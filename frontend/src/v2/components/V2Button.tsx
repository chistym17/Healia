import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type V2ButtonProps = {
  children: ReactNode;
  to?: string;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const variantClasses = {
  primary:
    "bg-healia-brand text-white shadow-[0_10px_24px_-14px_rgba(21,94,89,0.9)] hover:bg-healia-brand-dark focus-visible:ring-healia-brand",
  secondary:
    "bg-white text-healia-text border border-healia-border hover:border-healia-brand/30 hover:bg-healia-brand-light focus-visible:ring-healia-brand",
  text: "text-healia-text-secondary hover:text-healia-text bg-transparent",
};

export function V2Button({
  children,
  to,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled = false,
}: V2ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
