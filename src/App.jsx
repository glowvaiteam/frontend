import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import Adsense from "@/components/ads/Adsense";

/* ================= PAGES ================= */
import Index from "./pages/Index";
import FaceAnalyzer from "./pages/FaceAnalyzer";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import AnalysisDetail from "./pages/AnalysisDetail";
import Settings from "./pages/Settings";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Feedback from "./pages/Feedback";
import AdminFeedbacks from "./pages/AdminFeedbacks";

/* ================= FIREBASE ================= */
import { getAuth } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/* ================= QUERY CLIENT ================= */
const queryClient = new QueryClient();

/* ================= GOOGLE ANALYTICS ================= */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-ND4S03EYNB", {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

/* ================= APP CONTENT ================= */
const AppContent = ({ isDark, toggleDark }) => {
  const location = useLocation();

  const isAuthPage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Google Analytics */}
      <AnalyticsTracker />

      {/* Ads only for user pages */}
      {!isAuthPage && <Adsense />}

      {!isAuthPage && (
        <Header isDark={isDark} toggleDark={toggleDark} />
      )}

      <main className="flex-1 w-full pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/analyzer" element={<FaceAnalyzer />} />
          <Route path="/store" element={<Store />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analysis/:analysisId" element={<AnalysisDetail />} />
          <Route
            path="/settings"
            element={<Settings isDark={isDark} toggleDark={toggleDark} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileBottomNav />}
    </div>
  );
};

/* ================= MAIN APP ================= */
const App = () => {
  /* ---------- THEME ---------- */
  const [isDark, setIsDark] = useState(() => {
    try {
      const raw = localStorage.getItem("theme_pref");
      if (raw) {
        const obj = JSON.parse(raw);
        return obj.value === "dark";
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    const value = isDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(
      "theme_pref",
      JSON.stringify({ value, ts: Date.now() })
    );
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  /* ---------- ACTIVE USER TRACKING ---------- */
useEffect(() => {
  const auth = getAuth();
  let intervalId = null;

  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const ref = doc(db, "users", user.uid);

      // First update
      await updateDoc(ref, {
        last_active_at: serverTimestamp(),
      });

      // Update every 1 minute
      intervalId = setInterval(async () => {
        await updateDoc(ref, {
          last_active_at: serverTimestamp(),
        });
      }, 60000);
    }
  });

  return () => {
    unsubscribe();
    if (intervalId) clearInterval(intervalId);
  };
}, []);


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AppContent isDark={isDark} toggleDark={toggleDark} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
