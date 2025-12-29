import { useState, useEffect } from "react";
import { Scan, ShoppingBag, Lightbulb, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { PreviewCard } from "@/components/ui/preview-card";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const features = [
  {
    icon: Scan,
    title: "AI Face Analyzer",
    description:
      "Advanced AI scans your face to detect skin tone, acne, spots, texture, and more with precision.",
  },
  {
    icon: Lightbulb,
    title: "Personal Beauty Recommendations",
    description: "Get product suggestions tailored specifically for your unique skin type and concerns.",
  },
  {
    icon: ShoppingBag,
    title: "Curated Product Store",
    description:
      "Browse beauty products carefully selected and recommended based on your skin analysis.",
  },
  {
    icon: Lightbulb,
    title: "Smart Skincare Guidance",
    description: "Receive personalized routine suggestions and tips powered by AI intelligence.",
  },
  {
    icon: Shield,
    title: "Safe & Private AI",
    description: "Your data is secure with on-device processing and encrypted cloud protection.",
  },
];

export default function Index() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalTimer, setModalTimer] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check profile status
  const checkProfileStatus = async (u) => {
    if (!u) return false;
    try {
      const token = await u.getIdToken();
      const response = await axios.get("https://glowvai-backend-v85o.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Profile is complete only if ALL required fields are filled
      const hasRequiredFields = response.data.age && response.data.gender && response.data.height && response.data.weight;
      const isComplete = response.data.profile_completed && hasRequiredFields;
      
      console.log("Profile status:", {
        profile_completed: response.data.profile_completed,
        age: response.data.age,
        gender: response.data.gender,
        height: response.data.height,
        weight: response.data.weight,
        hasRequiredFields,
        isComplete,
      });
      
      setProfileCompleted(isComplete);
      return isComplete;
    } catch (error) {
      console.error("Error checking profile:", error);
      return false;
    }
  };

  // Initial auth state check
  useEffect(() => {
    let unsub;
    try {
      unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          const isCompleted = await checkProfileStatus(u);
          if (!isCompleted) {
            setShowProfileModal(true);
            // Start interval to show modal every 30s
            if (!modalTimer) {
              const timer = setInterval(async () => {
                const stillIncomplete = !(await checkProfileStatus(u));
                if (stillIncomplete) setShowProfileModal(true);
              }, 30000);
              setModalTimer(timer);
            }
          } else {
            setShowProfileModal(false);
            if (modalTimer) {
              clearInterval(modalTimer);
              setModalTimer(null);
            }
          }
        } else {
          setShowProfileModal(false);
          if (modalTimer) {
            clearInterval(modalTimer);
            setModalTimer(null);
          }
        }
      });
    } catch (e) {
      // ignore in non-auth environments
    }
    return () => {
      if (unsub) unsub();
      if (modalTimer) clearInterval(modalTimer);
    };
  }, [modalTimer]);

  // ...existing code...
  // Modal popup for incomplete profile
  const handleCloseModal = () => {
    setShowProfileModal(false);
  };
  const handleGoProfile = () => {
    setShowProfileModal(false);
    navigate("/profile");
  };

  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Profile Completion Modal (only for logged-in users with incomplete profile) */}
      {user && showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center relative">
            <h3 className="text-xl font-bold mb-2 text-primary">Complete Your Profile</h3>
            <p className="mb-4 text-muted-foreground">Fill in your details to unlock all features and get personalized recommendations.</p>
            <div className="flex gap-4 justify-center mt-4">
              <Button onClick={handleGoProfile} className="bg-primary text-white rounded-full px-6 py-2">Go</Button>
              <Button variant="outline" onClick={handleCloseModal} className="rounded-full px-6 py-2">Close</Button>
            </div>
            <div className="absolute top-2 right-2 text-xs text-muted-foreground">This reminder will repeat every 30 seconds until completed.</div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        onMouseMove={handleHeroMouseMove}
      >
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Animated beauty glow layer */}
        <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50">
          <div className="h-full w-full pulse bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.35),transparent_55%),radial-gradient(circle_at_80%_80%,hsl(var(--primary)/0.2),transparent_55%)]" />
        </div>
        {/* Cursor-follow highlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 md:opacity-60"
          style={{
            background: `radial-gradient(600px at ${cursorPosition.x}px ${cursorPosition.y}px, hsl(var(--primary) / 0.45), transparent 65%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        {/* Content */}
        <div className="container relative px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {!user && (
              <div className="mb-8 px-4 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">Welcome to {" "}<span className="text-gradient">GLOWVAI</span></h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Discover your perfect skincare routine with AI-powered insights.</p>
                <div className="flex justify-center gap-4">
                  <Button asChild size="lg" className="rounded-full bg-yellow-400 text-black shadow-md px-6 py-2 hover:bg-yellow-500">
                    <Link to="/signup">Get Started - Sign Up</Link>
                  </Button>
                  <Button asChild size="lg" className="rounded-full bg-white/20 text-white border border-white/40 px-6 py-2 hover:bg-yellow-200 hover:text-black hover:border-yellow-300">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            )}
           
            {user && (
              <>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                  Unlock Your Best Skin with{" "}
                  <span className="text-gradient">GLOWVAI</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Personalized face analysis, beauty product recommendations, and premium skincare insights — all
                  powered by cutting-edge AI.
                </p>
              </>
            )}
            {user && (
              <div className="flex flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="w-1/2 sm:w-auto rounded-full gradient-primary glow-primary text-primary-foreground border-0 px-4"
                >
                  <Link to="/analyzer">Try Face Analyzer</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-1/2 sm:w-auto rounded-full px-4">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* What is GLOWVAI */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What is <span className="text-gradient">GLOWVAI</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              GLOWVAI combines advanced artificial intelligence with beauty expertise to give you personalized skincare
              insights. Our AI analyzes your unique skin characteristics and provides tailored recommendations for
              products and routines that work specifically for you.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a complete AI-powered skincare experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant={index === 0 ? "highlighted" : "default"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Preview Cards */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Begin your personalized skincare journey with GLOWVAI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PreviewCard
              icon={Scan}
              title="Try Face Analyzer"
              description="Upload your photo and get instant AI-powered skin analysis"
              href="/analyzer"
              variant="primary"
            />
            <PreviewCard
              icon={ShoppingBag}
              title="Explore Store"
              description="Browse curated beauty products recommended for your skin"
              href="/store"
              variant="secondary"
              disabled
              badge="Coming Soon"
            />
            <PreviewCard
              icon={Lightbulb}
              title="Beauty Insights"
              description="Access personalized tips and skincare routines"
              href="/profile"
              variant="accent"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
