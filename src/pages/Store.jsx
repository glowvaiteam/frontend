import { ShoppingBag, Bell, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export default function Store() {
  const [email, setEmail] = useState("");

  const handleNotify = () => {
    if (!email) {
      toast("Email required", {
        description: "Please enter your email to request early access.",
      });
      return;
    }

    const subject = "Early Access Request – GLOWVAI Store";
    const body = `Hello GLOWVAI Team,

I would like to request early access to the GLOWVAI Store.

My email: ${email}

Please let me know the next steps.

Thank you,`;

    // ✅ Open mail app
    window.location.href = `mailto:glowvai.team@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    toast("Opening email app ✉️", {
      description: "Please send the email to complete your request.",
    });

    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="relative max-w-2xl mx-auto text-center">
        {/* Background Decoration */}
        <div className="absolute inset-0 gradient-hero opacity-50 blur-3xl -z-10" />

        {/* Icon */}
        <div className="relative mx-auto mb-8">
          <div className="w-32 h-32 mx-auto rounded-3xl gradient-primary flex items-center justify-center glow-primary">
            <ShoppingBag className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Coming <span className="text-gradient">Soon</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Our curated beauty store is launching soon! Products recommended by the
          Face Analyzer will appear here.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-2 mb-8 sm:gap-4 sm:mb-12">
          <Feature icon={<BrainCircuit />} label="AI Recommendations" />
          <Feature icon={<ShoppingBag />} label="Curated Products" />
          <Feature icon={<Bell />} label="Exclusive Deals" />
        </div>

        {/* Notify Form */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-full h-12 px-6"
          />
          <Button
            className="rounded-full h-12 px-8 gradient-primary text-primary-foreground"
            onClick={handleNotify}
          >
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Small helper */
function Feature({ icon, label }) {
  return (
    <div className="p-2 sm:p-4 rounded-xl bg-card border border-border/50 flex flex-col items-center">
      <div className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 rounded-lg bg-secondary flex items-center justify-center text-primary">
        {icon}
      </div>
      <p className="text-[10px] sm:text-xs font-medium text-center leading-tight">
        {label}
      </p>
    </div>
  );
}
