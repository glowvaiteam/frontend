import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { X, Instagram, Facebook, Mail } from "lucide-react";

export default function Contact() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div className="flex flex-col bg-[#FFFCF5]">
      {/* HERO SECTION */}
      <section
        className="relative min-h-[35vh] flex items-center overflow-hidden"
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

        <div className="container relative px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Contact Us
            </h1>
            <p className="text-muted-foreground mb-6">
              Have a question or feedback? We’d love to hear from you.
            </p>
            <Button
              size="lg"
              className="rounded-full gradient-primary glow-primary px-8"
              onClick={() =>
                document
                  .getElementById("contact-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get Help
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT CARD */}
      <section id="contact-section" className="py-14">
        <div className="container px-4 md:px-6 flex justify-center">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] px-8 py-12">

            {/* HEADER */}
            <div className="text-center mb-10">
              <h3 className="text-2xl font-semibold mb-2">
                Connect with us
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow GLOWVAI on social media or send us an email.
              </p>
            </div>

            {/* SOCIAL GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">

              <SocialCard
                icon={<X />}
                title="X"
                subtitle="@Glowvai"
                href="https://x.com/Glowvai"
                external
              />

              <SocialCard
                icon={<Instagram />}
                title="Instagram"
                subtitle="@glowvai"
                href="https://www.instagram.com/glowvai?igsh=MTV6Znk1ZHd2OGd5eg=="
                external
              />

              <SocialCard
                icon={<Facebook />}
                title="Facebook"
                subtitle="/glowvai"
                href="https://www.facebook.com/share/1AT8qi4mEC/"
                external
              />

              <SocialCard
                icon={<Mail />}
                title="Email"
                subtitle={
                  <>
                    contact@glowvai.in
                    <br />
                    +91 8977855998
                    <br />
                    Vijayawada
                  </>
                }
                href="mailto:contact@glowvai.in"
              />

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* 🔹 Reusable Social Card */
function SocialCard({ icon, title, subtitle, href, external }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      title={title === "Email" ? "Send us an email" : undefined}
      className="flex items-center gap-4 p-5 rounded-2xl bg-[#FFF7E6]
                 hover:bg-[#FFEEC6] transition-all hover:-translate-y-1
                 shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-[#FFE4A3] flex items-center justify-center text-[#E6A700]">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </a>
  );
}
