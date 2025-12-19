import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Facebook, Mail } from "lucide-react";

export default function Contact() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Open mail client as a fallback with prefilled subject/body
    const subject = `Contact from ${name}`;
    const body = `${message}\n\n---\nFrom: ${name} <${email}>`;
    window.location.href = `mailto:contact@glowvai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  return (
    <div className="flex flex-col">
      <section
        className="relative min-h-[40vh] flex items-center overflow-hidden"
        onMouseMove={handleHeroMouseMove}
      >
        <div className="absolute inset-0 gradient-hero" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50">
          <div className="h-full w-full pulse bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.35),transparent_55%),radial-gradient(circle_at_80%_80%,hsl(var(--primary)/0.2),transparent_55%)]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-40 md:opacity-60"
          style={{
            background: `radial-gradient(600px at ${cursorPosition.x}px ${cursorPosition.y}px, hsl(var(--primary) / 0.45), transparent 65%)`,
          }}
        />

        <div className="container relative px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Contact Us</h1>
            <p className="text-muted-foreground mb-6">Have a question or feedback? We’d love to hear from you.</p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="rounded-full gradient-primary glow-primary text-primary-foreground px-8"
                onClick={() => {
                  const el = document.getElementById("contact-form-section");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                Get Help
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-card p-4 sm:p-6 md:p-10 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Social / Info */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect with us</h3>
                <p className="text-sm text-muted-foreground">Follow GLOWVAI on social media or send us an email.</p>
              </div>

              <nav className="flex flex-col gap-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Twitter className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Twitter</div>
                    <div className="text-xs text-muted-foreground">@glowvai</div>
                  </div>
                </a>

                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Instagram</div>
                    <div className="text-xs text-muted-foreground">@glowvai</div>
                  </div>
                </a>

                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Facebook className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Facebook</div>
                    <div className="text-xs text-muted-foreground">/glowvai</div>
                  </div>
                </a>

                {/* LinkedIn removed by request */}

                <a href="mailto:contact@glowvai.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-xs text-muted-foreground">contact@glowvai.com</div>
                  </div>
                </a>
              </nav>
            </div>

            {/* Right: Form */}
            <div id="contact-form-section" className="md:col-span-2">
              {submitted ? (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">Thank you</h2>
                  <p className="text-muted-foreground">Your message was prepared in your mail client. If you didn't send it, please try again or reach us at contact@glowvai.com.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg" className="w-full md:w-auto rounded-full gradient-primary glow-primary text-primary-foreground px-8">
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
