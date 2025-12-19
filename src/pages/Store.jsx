import { ShoppingBag, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export default function Store() {
  const [email, setEmail] = useState("");

  const handleNotify = () => {
    if (email) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when the store launches.",
      });
      setEmail("");
    }
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
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent flex items-center justify-center animate-pulse">
            <Sparkles className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Coming <span className="text-gradient">Soon</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Our curated beauty store is launching soon! Products recommended by the Face Analyzer will appear here.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium">AI Recommendations</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Curated Products</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Exclusive Deals</p>
          </div>
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
            Notify Me
          </Button>
        </div>
      </div>
    </div>
  );
}
