import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings, Moon, Sun, Info, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Face Analyzer", href: "/analyzer" },
  { label: "Store", href: "/store" },
];

export function Header({ isDark, toggleDark }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      unsub = onAuthStateChanged(auth, async (u) => {
       setUser(u);

if (u) {
  // INSTANT UI (no wait)
  setProfile({
    full_name: u.displayName || "User",
    profile_image: u.photoURL || null,
  });

  // THEN fetch backend profile in background
  try {
    const token = await u.getIdToken();
    const response = await fetch(
      "https://glowvai-backend-v85o.onrender.com/api/user/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setProfile(data); // overwrite with real data
    }
  } catch {
    // keep fallback
  }
} else {
  setProfile(null);
}

      });
    } catch (e) {
      // ignore in non-auth environments
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-xl tracking-tight">
            GLOW<span className="text-gradient">VAI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth / action (only visible on md+) */}
        <div className="hidden md:flex items-center gap-3">
          {user && profile ? (
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-secondary transition">
              {profile.profile_image && profile.profile_image.length > 0 ? (
                <span className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                  <img
                    src={profile.profile_image}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                    style={{ aspectRatio: '1/1' }}
                  />
                </span>
              ) : (
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {/* Show first letter of full name */}
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="flex flex-col leading-tight min-w-0">
                {/* Show full name as main name if available */}
                <span className="font-bold text-base truncate">{profile.full_name}</span>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 transition shadow-sm">
              <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.761 0 5.313.878 7.379 2.373M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium">Login / Signup</span>
            </Link>
          )}
        </div>

        {/* Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-80">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-6">
              {/* Mobile Navigation */}
              <div className="md:hidden space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg transition-all",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-all"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span>Settings</span>
                </Link>
                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary transition-all">
                  <div className="flex items-center gap-3">
                    {isDark ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span>Dark Mode</span>
                  </div>
                  <Switch checked={isDark} onCheckedChange={toggleDark} />
                </div>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-all"
                >
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <span>About Us</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-all"
                >
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>Contact</span>
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-all"
                >
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span>Privacy Policy</span>
                </Link>
              </div>
            </div>
          </SheetContent>
         </Sheet>
       </div>
     </header>
  );
}
