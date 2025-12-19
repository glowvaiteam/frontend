import { Sparkles, Heart, Shield, Users, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Pushing the boundaries of AI in beauty technology",
  },
  {
    icon: Heart,
    title: "Care",
    description: "Genuine commitment to your skin health journey",
  },
  {
    icon: Shield,
    title: "Privacy",
    description: "Your data security is our top priority",
  },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Founder", avatar: "SC" },
  { name: "Alex Rivera", role: "Head of AI", avatar: "AR" },
  { name: "Maya Patel", role: "Lead Designer", avatar: "MP" },
  { name: "Jordan Kim", role: "Dermatology Advisor", avatar: "JK" },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="container relative px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Driven Beauty <span className="text-gradient">Clarity</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              GLOWVAI was born from a simple belief: everyone deserves personalized skincare guidance. We combine cutting-edge artificial intelligence with dermatological expertise to help you understand and care for your unique skin.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                We're on a mission to democratize skincare knowledge. Traditional dermatology consultations can be expensive and inaccessible. GLOWVAI bridges that gap with AI technology that provides instant, accurate skin analysis and personalized recommendations.
              </p>
              <p className="text-muted-foreground">
                Our AI has been trained on millions of skin images and validated by board-certified dermatologists, ensuring you receive trustworthy insights every time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold text-primary">500K+</p>
                <p className="text-sm text-muted-foreground">Happy Users</p>
              </Card>
              <Card className="p-6 text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="text-sm text-muted-foreground">Analyses Done</p>
              </Card>
              <Card className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold text-primary">3s</p>
                <p className="text-sm text-muted-foreground">Avg Analysis Time</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide everything we do at GLOWVAI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate people behind GLOWVAI
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{member.avatar}</span>
                </div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <Card className="max-w-2xl mx-auto gradient-primary text-center p-12 border-0">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Skincare Journey?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Experience the power of AI-driven beauty insights today.
              </p>
              <a
                href="/analyzer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-background text-foreground font-medium hover:bg-background/90 transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                Try Face Analyzer
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
