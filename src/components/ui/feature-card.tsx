import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "highlighted";
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  variant = "default",
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1",
        variant === "default" && "bg-card border border-border/50 hover:shadow-lg hover:border-primary/20",
        variant === "highlighted" && "glass glow-primary",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
          variant === "default" && "bg-secondary",
          variant === "highlighted" && "gradient-primary"
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6",
            variant === "default" && "text-primary",
            variant === "highlighted" && "text-primary-foreground"
          )}
        />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
