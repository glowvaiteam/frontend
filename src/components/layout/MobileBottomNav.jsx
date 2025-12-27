import { Link, useLocation } from "react-router-dom";
import { Home, Scan, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Face", href: "/analyzer", icon: Scan },
  { label: "Store", href: "/store", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(auth, (u) => setUser(u));
      try {
        const t = localStorage.getItem("token");
        if (t) setHasToken(true);
      } catch (e) {}
      return () => unsub();
    } catch (e) {
      try {
        const t = localStorage.getItem("token");
        if (t) setHasToken(true);
      } catch (e) {}
    }
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          // if profile and unauthenticated, redirect to /login
          const to = item.label === "Profile" && !user && !hasToken ? "/login" : item.href;
          return (
            <Link
              key={item.href}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
