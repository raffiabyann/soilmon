import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Reusable card surface (SPEC §32.13).
 *
 * Soft hairline border, moderate radius, subtle low-elevation shadow. No heavy
 * shadows, glow, or glassmorphism. Surface/border/text colors come from theme
 * tokens so light/dark switch is token-only (SPEC §17).
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-card transition-shadow duration-150 ease-out",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
