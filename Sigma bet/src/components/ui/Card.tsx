import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  glow,
  padding = "md",
}: CardProps) {
  const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={`glass-card rounded-2xl ${paddings[padding]} ${
        glow ? "animate-pulse-ring" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
