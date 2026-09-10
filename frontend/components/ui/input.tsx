import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/12 bg-white/[0.055] px-4 py-2 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground backdrop-blur-sm focus:border-primary/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-primary/10",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
