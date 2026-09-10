import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border/90 bg-card/80 px-3 py-2 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:bg-card focus:ring-4 focus:ring-primary/10",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
