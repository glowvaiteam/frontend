import { useState, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import Index from "./pages/Index";
import FaceAnalyzer from "./pages/FaceAnalyzer";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("theme_pref");
        if (raw) {
          const obj = JSON.parse(raw);
          const age = Date.now() - (obj.ts || 0);
          const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
          if (age >= 0 && age <= TWO_DAYS) {
            return obj.value === "dark";
          }
        }
      } catch (e) {
        // ignore parse errors
      }
      // default to light for first-time or expired pref
      return false;
    }
    return false;
  });

  useEffect(() => {
    const value = isDark ? "dark" : "light";
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem(
        "theme_pref",
        JSON.stringify({ value: value, ts: Date.now() })
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <div className="relative flex min-h-screen w-full flex-col">
            <Header isDark={isDark} toggleDark={toggleDark} />
            <main className="flex-1 w-full pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/analyzer" element={<FaceAnalyzer />} />
                <Route path="/store" element={<Store />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings isDark={isDark} toggleDark={toggleDark} />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
