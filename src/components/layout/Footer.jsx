import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import GlowvaiTransLogo from "@/assets/glowvaitrans.svg";
import WWILogo from "@/assets/wwi.svg";

export function Footer() {
  return (
    <footer className="hidden md:block border-t bg-card/50">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={GlowvaiTransLogo}
                alt="Glowvai Logo"
                className="h-16 md:h-24 w-auto"
                draggable={false}
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered beauty technology for personalized skincare insights and recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/analyzer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Face Analyzer
              </Link>
              <Link to="/store" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Store
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GLOWVAI. All rights reserved.
          </p>
          <a href="https://wwi.org.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group" style={{ textDecoration: 'none' }}>
            <img src={WWILogo} alt="WWI Logo" className="h-12 md:h-16 w-auto" draggable={false} />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground group-hover:text-foreground">Made with WWI</span>
              <span className="text-sm font-bold text-foreground">WORK WIZARDS</span>
              <span className="text-xs text-muted-foreground">INNOVATIONS</span>
            </div>
          </a>

        </div>
      </div>
    </footer>
  );
}
