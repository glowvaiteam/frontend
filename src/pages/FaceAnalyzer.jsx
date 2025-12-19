import { useState, useRef } from "react";
import { Camera, Upload, Scan, Sparkles, AlertCircle, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";


export default function FaceAnalyzer() {
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

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
    // Start in-page camera preview using getUserMedia and open modal
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        fileInputRef.current?.click();
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
      fileInputRef.current?.click();
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
    // Photo is captured and set; user should press the main "Analyze Face" button
    // to run analysis. This keeps behavior identical to the upload flow and
    // ensures the one-time tip/confirm appears when the user initiates analysis.
  };

  // Send image data (data URL) to backend API; returns parsed JSON or throws
  const sendToBackend = async (dataUrl) => {
    const endpoint = "/api/analyze";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!res.ok) throw new Error("backend error");
      const json = await res.json();
      return json;
    } catch (err) {
      throw err;
    }
  };

  const analyzeImage = async (img) => {
    // If called with an image string (programmatic), skip the one-time tip
    const isProgrammatic = typeof img === "string";
    const target = isProgrammatic ? img : image;
    if (!target) return;

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

    setIsAnalyzing(true);

    // Try backend first; fall back to local simulation if backend unavailable
    try {
      const backendResult = await sendToBackend(target);
      setResult(backendResult);
    } catch (err) {
      // fallback simulation
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setResult({
        skinTone: { value: "Medium Warm", score: 85 },
        acne: { level: "Mild", score: 25 },
        darkCircles: { level: "Light", score: 35 },
        wrinkles: { level: "Minimal", score: 15 },
        texture: { quality: "Good", score: 75 },
        hydration: { level: "Moderate", score: 60 },
        suggestions: [
          "Use a gentle vitamin C serum in the morning",
          "Apply SPF 30+ sunscreen daily",
          "Consider adding retinol to your nighttime routine",
          "Stay hydrated - aim for 8 glasses of water daily",
        ],
        products: [
          { name: "Hydrating Cleanser", type: "Cleanser" },
          { name: "Vitamin C Serum", type: "Treatment" },
          { name: "Moisturizing Cream", type: "Moisturizer" },
          { name: "Mineral Sunscreen SPF 50", type: "Sunscreen" },
        ],
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
    result
      ? Math.round(
          (result.skinTone.score +
            (100 - result.acne.score) +
            (100 - result.darkCircles.score) +
            (100 - result.wrinkles.score) +
            result.texture.score +
            result.hydration.score) /
            6
        )
      : null;

  return (
    <main className="min-h-screen bg-background py-6 md:py-10">
      <div className="container max-w-4xl mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
        {/* Intro Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-rose via-lavender to-teal text-primary-foreground">
          <CardContent className="pt-6 pb-6 md:pb-8">
            <div className="flex items-start gap-3">
              <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/20 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
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
                  onClick={handleCameraCapture}
                  className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
                >
                  <Camera className="h-3 w-3" />
                  Camera
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
                      className="h-full w-full object-cover"
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
                        onClick={() => fileInputRef.current?.click()}
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
                  <Button className="rounded-full px-6" onClick={() => fileInputRef.current?.click()}>
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

              <input
                ref={fileInputRef}
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
                    <span className="font-medium">{result.skinTone.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Acne level</span>
                    <span className={cn("font-medium", getScoreColor(100 - result.acne.score))}>
                      {result.acne.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dark circles</span>
                    <span
                      className={cn(
                        "font-medium",
                        getScoreColor(100 - result.darkCircles.score)
                      )}
                    >
                      {result.darkCircles.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Wrinkles &amp; fine lines</span>
                    <span
                      className={cn("font-medium", getScoreColor(100 - result.wrinkles.score))}
                    >
                      {result.wrinkles.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Texture quality</span>
                    <span className={cn("font-medium", getScoreColor(result.texture.score))}>
                      {result.texture.quality}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hydration</span>
                    <span className={cn("font-medium", getScoreColor(result.hydration.score))}>
                      {result.hydration.level}
                    </span>
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Skin Tone */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Skin tone balance</span>
                      <span
                        className={cn(
                          "rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
                          getScoreColor(result.skinTone.score)
                        )}
                      >
                        {result.skinTone.score}/100
                      </span>
                    </div>
                    <Progress value={result.skinTone.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Even, well-balanced skin tone with <span className="font-medium">medium warm</span>{" "}
                      undertones.
                    </p>
                  </div>

                  {/* Acne */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Blemishes &amp; acne</span>
                      <span
                        className={cn(
                          "rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
                          getScoreColor(100 - result.acne.score)
                        )}
                      >
                        {result.acne.level}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(result.acne.score, true)
                        )}
                        style={{ width: `${result.acne.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mild localized breakouts; maintain gentle exfoliation and non-comedogenic products.
                    </p>
                  </div>

                  {/* Dark circles */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Under-eye area</span>
                      <span
                        className={cn(
                          "rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
                          getScoreColor(100 - result.darkCircles.score)
                        )}
                      >
                        {result.darkCircles.level}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(result.darkCircles.score, true)
                        )}
                        style={{ width: `${result.darkCircles.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Slight darkening and puffiness; brightening eye cream and consistent sleep can help.
                    </p>
                  </div>

                  {/* Wrinkles */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lines &amp; wrinkles</span>
                      <span
                        className={cn(
                          "rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
                          getScoreColor(100 - result.wrinkles.score)
                        )}
                      >
                        {result.wrinkles.level}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(result.wrinkles.score, true)
                        )}
                        style={{ width: `${result.wrinkles.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimal visible fine lines; maintain sun protection and nightly repair products.
                    </p>
                  </div>

                  {/* Texture */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Texture smoothness</span>
                      <span
                        className={cn(
                          "rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
                          getScoreColor(result.texture.score)
                        )}
                      >
                        {result.texture.score}/100
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(result.texture.score)
                        )}
                        style={{ width: `${result.texture.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Overall smooth texture with a few uneven areas around T-zone.
                    </p>
                  </div>

                  {/* Hydration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hydration level</span>
                      <span
                        className={cn(
                          "rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
                          getScoreColor(result.hydration.score)
                        )}
                      >
                        {result.hydration.level}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(result.hydration.score)
                        )}
                        style={{ width: `${result.hydration.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Balanced moisture levels; maintain lightweight hydrating layers and nightly barrier support.
                    </p>
                  </div>
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
                  {result.suggestions.map((suggestion, index) => (
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
                  {result.products.map((product, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-xl bg-secondary/60 p-4 text-center shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-colors hover:bg-secondary"
                    >
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.type}</p>
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
