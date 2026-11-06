import React from "react";

type BadgeVariant =
  | "ON_TIME"
  | "LATE"
  | "ACTIVE"
  | "INACTIVE"
  | "ADMIN"
  | "EMPLOYEE"
  | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  const styles: Record<BadgeVariant, string> = {
    ON_TIME: "bg-emerald-50 text-emerald-800 border-emerald-200",
    LATE: "bg-amber-50 text-amber-800 border-amber-200",
    ACTIVE: "bg-zinc-900 text-zinc-50 border-zinc-900",
    INACTIVE: "bg-zinc-100 text-zinc-600 border-zinc-200",
    ADMIN: "bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold",
    EMPLOYEE: "bg-zinc-100 text-zinc-900 border-zinc-300 font-medium",
    default: "bg-zinc-100 text-zinc-800 border-zinc-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
