import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default:
    "border border-primary/20 bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.55)] hover:bg-primary/90 hover:shadow-[0_12px_28px_-8px_hsl(var(--primary)/0.65)]",
  outline:
    "border border-white/15 bg-white/[0.04] backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
  ghost: "bg-transparent hover:bg-white/[0.06]",
  secondary:
    "border border-white/10 bg-white/[0.07] text-foreground backdrop-blur-sm hover:bg-white/[0.11] hover:border-white/18",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-[-0.01em] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
