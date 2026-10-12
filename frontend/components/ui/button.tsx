import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "secondary" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default:
    "border border-transparent bg-primary text-primary-foreground shadow-subtle hover:bg-indigo-700 focus-visible:ring-primary/30",
  outline:
    "border border-border bg-white text-foreground shadow-subtle hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-300",
  ghost:
    "text-foreground hover:bg-slate-100 hover:text-foreground focus-visible:ring-slate-300",
  secondary:
    "border border-slate-200 bg-slate-100 text-foreground hover:bg-slate-200/80 focus-visible:ring-slate-300",
  destructive:
    "border border-transparent bg-destructive text-destructive-foreground shadow-subtle hover:bg-red-600 focus-visible:ring-destructive/30",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9.5 px-4 text-sm rounded-lg",
  lg: "h-11 px-5 text-sm font-medium rounded-lg",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
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
