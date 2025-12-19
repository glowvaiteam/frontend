import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "primary" | "secondary" | "accent";
  disabled?: boolean;
  badge?: string;
}

export function PreviewCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "primary",
  disabled = false,
  badge,
}: PreviewCardProps) {
  const Card = disabled ? "div" : Link;

  return (
    <Card
      to={disabled ? undefined : href}
      className={cn(
        "group relative flex flex-col p-6 rounded-2xl transition-all duration-300 overflow-hidden",
        !disabled && "cursor-pointer hover:-translate-y-1 hover:shadow-xl",
        disabled && "opacity-70 cursor-not-allowed",
        variant === "primary" && "gradient-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary",
        variant === "accent" && "bg-accent"
      )}
    >
      {badge && (
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full bg-background/20 backdrop-blur-sm">
          {badge}
        </span>
      )}
      <Icon
        className={cn(
          "h-8 w-8 mb-4",
          variant === "primary" && "text-primary-foreground",
          variant === "secondary" && "text-primary",
          variant === "accent" && "text-accent-foreground"
        )}
      />
      <h3
        className={cn(
          "font-semibold text-lg mb-2",
          variant === "secondary" && "text-foreground",
          variant === "accent" && "text-accent-foreground"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-sm mb-4 flex-1",
          variant === "primary" && "text-primary-foreground/80",
          variant === "secondary" && "text-muted-foreground",
          variant === "accent" && "text-accent-foreground/80"
        )}
      >
        {description}
      </p>
      {!disabled && (
        <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
          <span>{disabled ? "Coming Soon" : "Get Started"}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </Card>
  );
}
