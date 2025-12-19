import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground mb-6">Last updated: December 18, 2025</p>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We respect your privacy. Below is an overview of how we handle your data when you use GLOWVAI.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="rounded-full gradient-primary glow-primary text-primary-foreground px-8">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <p className="mb-4">
              Welcome to GLOWVAI. Your privacy is important to us. This Privacy Policy explains how we collect, use,
              disclose, and protect information when you use our website and services.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (when you create an account): name, email, and profile details.</li>
              <li>
                Uploaded images: We may process images you upload for face analysis. Images are used only to provide the
                requested analysis and are not shared with third parties except as described below.
              </li>
              <li>Usage data: pages visited, features used, and diagnostic information to improve the service.</li>
              <li>Device and browser information, and IP address.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain the service, including face analysis and personalized recommendations.</li>
              <li>To improve and customize the user experience.</li>
              <li>To communicate with you about updates, security, and support.</li>
              <li>For fraud prevention, legal compliance, and safety.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-3">3. Image Handling & Retention</h2>
            <p className="mb-4">
              Images you upload for analysis are processed to produce results. Unless you explicitly grant permission or
              we state otherwise, we retain images only as long as necessary to provide the service or as required by
              law. If you want your images deleted, contact us at the address below and we will take reasonable steps to
              remove them.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">4. Sharing & Third Parties</h2>
            <p className="mb-4">
              We do not sell personal information. We may share data with service providers who help operate our services
              (e.g., hosting, analytics). These providers are contractually bound to protect your data. We may also
              disclose information to comply with legal obligations or to protect rights and safety.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">5. Security</h2>
            <p className="mb-4">
              We implement reasonable technical and organizational measures to protect personal information. However, no
              system is completely secure; please use caution when transmitting sensitive information.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">6. Children</h2>
            <p className="mb-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information from
              children under 13. If we learn that we have collected such information, we will take steps to delete it.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">7. Your Choices</h2>
            <p className="mb-4">
              You can access, update, or request deletion of your personal information by contacting us. You may opt out
              of promotional emails by following the unsubscribe instructions in those messages.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">8. Changes to this Policy</h2>
            <p className="mb-4">
              We may update this policy from time to time. We will post the revised policy on this page with an updated
              "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">9. Contact</h2>
            <p className="mb-4">If you have questions or requests regarding this policy, contact us at: privacy@glowvai.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
