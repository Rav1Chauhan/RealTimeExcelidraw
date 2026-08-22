import { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
  title?: string;
  href?: string;
}

export function Card({
  className = "",
  title,
  children,
  href,
}: CardProps) {
  const content = (
    <div className={`rounded-xl bg-card text-card-foreground ${className}`}>
      {title && <h3 className="sr-only">{title}</h3>}
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}