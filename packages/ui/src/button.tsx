"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  size: "lg" | "sm";
}

export const Button = ({
  children,
  className,
  size,
  variant,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`
        ${className ?? ""}
        ${variant === "primary"
          ? "bg-primary"
          : variant === "secondary"
            ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
            : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        }
        ${size === "lg" ? "px-4 py-2" : "px-2 py-1"}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
