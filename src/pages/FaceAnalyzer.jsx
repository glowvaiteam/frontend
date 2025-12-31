import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Camera, Upload, Scan, Sparkles, AlertCircle, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FaceAnalyzer() {
  const [image, setImage] = useState(null);
  // Privacy settings (sync with localStorage)
  const [dataProcessing, setDataProcessing] = useState(() => {
    const val = localStorage.getItem("glowvai_data_processing");
    return val === null ? false : val === "true";
  });
  const [saveAnalysisHistory, setSaveAnalysisHistory] = useState(() => {
    const val = localStorage.getItem("glowvai_save_analysis_history");
    return val === null ? false : val === "true";
  });
  const [privacyConsent, setPrivacyConsent] = useState(() => {
    return localStorage.getItem("glowvai_privacy_consent") === "true";
  });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // prevent page scrolling and ensure overlay covers everything when modal open
  useEffect(() => {
    if (showLoginModal || showPermissionModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoginModal, showPermissionModal]);

  // Keep state in sync with localStorage (for Settings page changes)
  useEffect(() => {
    const onStorage = () => {
      setDataProcessing(localStorage.getItem("glowvai_data_processing") === "true");
      setSaveAnalysisHistory(localStorage.getItem("glowvai_save_analysis_history") === "true");
      setPrivacyConsent(localStorage.getItem("glowvai_privacy_consent") === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Handle file select for both gallery and camera inputs
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    // if user not logged in, show login prompt
    try {
      const user = auth.currentUser;
      if (!user) {
        setShowLoginModal(true);
        return;
      }
    } catch (e) {
      // ignore
    }
    // Start in-page camera preview using getUserMedia and open modal
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraInputRef.current?.click();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err) {
      console.error("Camera access failed:", err);
      cameraInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } catch (e) {
      // ignore
    }
  };

  const takePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setImage(dataUrl);
    setResult(null);
    stopCamera();
  };

  // Send image data (data URL) to backend API; returns parsed JSON or throws
  const sendToBackend = async (dataUrl) => {
    // Try authenticated first, then fall back to demo
    const endpoints = [
      { url: "https://glowvai-backend-v85o.onrender.com/api/ml/analyze-face", requiresAuth: true, name: "Authenticated" },
      { url: "https://glowvai-backend-v85o.onrender.com/api/ml/analyze-face-demo", requiresAuth: false, name: "Demo" }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`\n📤 Trying ${endpoint.name} endpoint: ${endpoint.url}`);

        let headers = {};
        
        if (endpoint.requiresAuth) {
          const token = await auth.currentUser?.getIdToken();
          console.log(`Token status: ${token ? "✅ Present" : "❌ Missing"}`);
          
          if (!token) {
            console.log("⏭️ Skipping authenticated endpoint - no token");
            continue;
          }
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Create FormData and append image
        const formData = new FormData();
        formData.append("image", blob, "selfie.jpg");

        console.log("📤 Sending request...");

        // Send to backend
        const res = await fetch(endpoint.url, {
          method: "POST",
          headers,
          body: formData,
        });

        console.log(`📥 Response status: ${res.status}`);

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ ${endpoint.name} failed (${res.status}):`, errorText);
          continue; // Try next endpoint
        }

        const json = await res.json();
        console.log(`✅ ${endpoint.name} SUCCESS!`, json);
        return json;
        
      } catch (err) {
        console.error(`⚠️ ${endpoint.name} error:`, err.message);
        continue; // Try next endpoint
      }
    }

    // All endpoints failed
    throw new Error("All endpoints failed - check console logs above");
  };

  const analyzeImage = async (img) => {
    // If called with an image string (programmatic), skip the one-time tip
    const isProgrammatic = typeof img === "string";
    const target = isProgrammatic ? img : image;
    if (!target) return;

    // Privacy & permission check: block if not both ON
    const currentDataProcessing = localStorage.getItem("glowvai_data_processing") === "true";
    const currentSaveAnalysisHistory = localStorage.getItem("glowvai_save_analysis_history") === "true";
    const currentConsent = localStorage.getItem("glowvai_privacy_consent") === "true";
    if (!currentDataProcessing || !currentSaveAnalysisHistory || !currentConsent) {
      setShowPermissionModal(true);
      setConsentChecked(false);
      return;
    }

    if (!isProgrammatic) {
      try {
        const shown = localStorage.getItem("glowvai_analyzer_tip_shown");
        if (!shown) {
          const ok = window.confirm(
            "For best mobile results: hold portrait orientation, use natural lighting, and keep your full face visible. Proceed with analysis?"
          );
          if (!ok) return;
          localStorage.setItem("glowvai_analyzer_tip_shown", "1");
        }
      } catch (e) {
        // ignore storage errors and continue
      }
    }

    // if not logged in, prompt to login before analyzing
    try {
      const user = auth.currentUser;
      if (!user) {
        setShowLoginModal(true);
        return;
      }
    } catch (e) {
      // ignore
    }

    setIsAnalyzing(true);

    // Try backend first; fall back to local simulation if backend unavailable
    try {
      const backendResult = await sendToBackend(target);
      setResult(backendResult);
    } catch (err) {
      // fallback simulation - matches actual backend structure
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setResult({
        image_url: "",
        report: {
          portrait_score: 45,
          snapshot_overview: {
            skin_tone: "Fair",
            skin_type: "Normal",
            acne_level: "Severe",
            dark_spots: "Light",
            texture_quality: "Uneven"
          },
          feature_analysis: {
            eyes: "Average",
            eyebrows: "Needs Improvement",
            nose: "Average",
            lips: "Average",
            jawline: "Average",
            cheekbones: "Needs Improvement"
          },
          skin_concerns: {
            acne: "Severe",
            dark_spots: "Light",
            skin_clarity: "Uneven"
          },
          personalized_recommendations: [
            "Use a gentle salicylic acid cleanser daily",
            "Add niacinamide or vitamin C serum to your routine",
            "Always apply SPF 30+ sunscreen during the day"
          ],
          recommended_products: [
            "Salicylic Acid Cleanser",
            "Vitamin C Serum",
            "Broad Spectrum Sunscreen SPF 50"
          ]
        },
        analysis_id: "fallback"
      });
    }

    setIsAnalyzing(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-teal";
    if (score >= 40) return "text-rose";
    return "text-destructive";
  };

  const getProgressColor = (score, inverted = false) => {
    const adjustedScore = inverted ? 100 - score : score;
    if (adjustedScore >= 70) return "bg-teal";
    if (adjustedScore >= 40) return "bg-rose";
    return "bg-destructive";
  };

  const overallScore =
    result?.report?.portrait_score || null;

  return (
    <main className="min-h-screen bg-background py-6 md:py-10">
      <div className="container max-w-4xl mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        {/* Intro Card */}
        <Card className="border-0 shadow-xl gradient-primary text-primary-foreground">
          <CardContent className="pt-6 pb-6 md:pb-8">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-90">
                  Glowvai
                </p>
                <h1 className="mt-1 text-2xl md:text-3xl font-semibold">
                  AI Portrait &amp; Skin Analyzer
                </h1>
                <p className="mt-2 text-sm md:text-base text-primary-foreground/80 max-w-2xl">
                  Upload a clear selfie to get your portrait score, facial feature insights, skin analysis, and smart recommendations in seconds.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security Permissions Modal */}
        {showPermissionModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ zIndex: 2147483647 }}>
            <div className="bg-card rounded-lg w-full max-w-md p-6 shadow-lg" style={{ zIndex: 2147483648 }}>
              <h3 className="text-lg font-semibold mb-2">Privacy &amp; Security Permissions</h3>
              <div className="mb-4 text-sm text-muted-foreground">
                <p className="mb-2">To use the Face Analyzer, please review and accept the following permissions:</p>
                <ul className="mb-2 list-disc pl-5">
                  <li><b>Data Processing</b>: Your images will be processed securely for analysis. No images are stored unless you choose to save your analysis history.</li>
                  <li><b>Save Analysis History</b>: Allows you to track your progress over time by saving your analysis results to your account.</li>
                </ul>
                <p className="mb-2"><b>Medical Disclaimer:</b> This tool provides informational insights only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="privacy-consent-checkbox"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={e => setConsentChecked(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="privacy-consent-checkbox" className="text-sm">I have read and agree to the above permissions and disclaimer.</label>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPermissionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!consentChecked}
                  onClick={() => {
                    // Grant permissions, persist, and proceed
                    setDataProcessing(true);
                    setSaveAnalysisHistory(true);
                    setPrivacyConsent(true);
                    localStorage.setItem("glowvai_data_processing", "true");
                    localStorage.setItem("glowvai_save_analysis_history", "true");
                    localStorage.setItem("glowvai_privacy_consent", "true");
                    setShowPermissionModal(false);
                    setTimeout(() => analyzeImage(), 0); // proceed with analysis
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal for unauthenticated access */}
        {showLoginModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 2147483647 }}
            aria-hidden={false}
          >
            <div className="bg-card rounded-lg w-full max-w-md p-6 shadow-lg" style={{ zIndex: 2147483648 }}>
              <h3 className="text-lg font-semibold">Please sign in</h3>
              <p className="mt-2 text-sm text-muted-foreground">You need to be logged in to analyze images. Please sign in to continue.</p>
              <div className="mt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLoginModal(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    navigate("/login", { state: { from: location.pathname } });
                  }}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-base md:text-lg">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                <span>Upload Your Selfie</span>
              </div>
              <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                Best with natural light & straight-on angle
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Source Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Choose how you want to add your photo.</p>
              <div className="inline-flex rounded-full bg-muted px-1 py-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
                >
                  <Camera className="h-3 w-3" />
                  Camera
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Upload className="h-3 w-3" />
                  Gallery
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={cn(
                "relative mt-1 rounded-2xl border-2 border-dashed bg-muted/40 p-4 md:p-6 transition-colors",
                image
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-background/40"
              )}
            >
              {image ? (
                <div className="flex items-start gap-4">
                    <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-muted shadow-sm">
                    <img
                      src={image}
                      alt="Uploaded selfie"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Selected image</p>
                    <p className="text-xs text-muted-foreground">
                      Make sure your full face is visible with even lighting and minimal shadows.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        Change photo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-destructive"
                        onClick={() => {
                          setImage(null);
                          setResult(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Choose an image to get started</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Upload a clear, front-facing selfie for the most accurate analysis.
                    </p>
                  </div>
                  <Button className="rounded-full px-6" onClick={() => galleryInputRef.current?.click()}>
                    Upload from device
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Or open your camera to take a photo</p>
                  <div className="mt-2 flex gap-2">
                    <Button className="rounded-full px-4" onClick={handleCameraCapture}>
                      Open Camera
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Supported formats: JPG, PNG &bull; Max 10MB
                  </p>
                </div>
              )}

              {/* Camera preview (shows when cameraActive is true) */}
              {cameraActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="bg-card rounded-lg max-w-lg w-full p-4">
                    <video ref={videoRef} className="w-full rounded-md shadow-sm" playsInline muted />
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <Button size="lg" className="rounded-full px-6" onClick={takePhotoFromCamera}>
                        Capture
                      </Button>
                      <Button variant="outline" className="rounded-full px-4" onClick={stopCamera}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className={cn(
              "rounded-full px-12 transition-all duration-300",
              image
                ? "gradient-primary text-primary-foreground glow-primary"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            disabled={!image || isAnalyzing}
              onClick={() => analyzeImage()}
          >
            {isAnalyzing ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-5 w-5" />
                Analyze Face
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in-50 duration-500">
            {/* Portrait Score + Snapshot */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      2
                    </span>
                    Portrait Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-3 pb-6">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                    <div className="absolute inset-3 flex items-center justify-center rounded-full bg-background shadow-md">
                      <span className="text-3xl font-semibold text-foreground">
                        {overallScore}
                      </span>
                    </div>
                  </div>
                  <p className="max-w-xs text-center text-xs text-muted-foreground">
                    Overall portrait score combining symmetry, clarity, texture, and skin health detected by Glowvai AI.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Snapshot Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Skin tone</span>
                    <span className="font-medium">{result.report?.snapshot_overview?.skin_tone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Acne level</span>
                    <span className="font-medium">{result.report?.snapshot_overview?.acne_level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dark spots</span>
                    <span className="font-medium">{result.report?.snapshot_overview?.dark_spots}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Skin type</span>
                    <span className="font-medium">{result.report?.snapshot_overview?.skin_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Texture quality</span>
                    <span className="font-medium">{result.report?.snapshot_overview?.texture_quality}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Feature Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(result.report?.feature_analysis || {}).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground capitalize mb-1">{key.replace('_', ' ')}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(result.report?.personalized_recommendations || []).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-teal flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Recommended Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {(result.report?.recommended_products || []).map((product, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-xl bg-secondary/60 p-4 text-center shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-colors hover:bg-secondary"
                    >
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{product}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-0 bg-gradient-to-r from-rose via-lavender to-teal text-primary-foreground shadow-xl">
              <CardContent className="flex flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center md:py-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-90">
                    Discover your glow potential
                  </p>
                  <h2 className="mt-2 text-lg font-semibold md:text-xl">
                    Save this analysis &amp; track your skin journey over time.
                  </h2>
                  <p className="mt-1 max-w-md text-xs text-primary-foreground/85 md:text-sm">
                    Come back with new selfies to see how your portrait score and skin metrics improve as you follow your routine.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="rounded-full bg-background/90 px-6 text-sm font-medium text-foreground hover:bg-background"
                >
                  Start new scan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
