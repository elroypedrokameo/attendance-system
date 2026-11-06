import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}) => {
  const iconBg = {
    default: "bg-zinc-100 text-zinc-900",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-zinc-900 text-zinc-50",
  }[variant];

  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-zinc-900 tabular-nums">{value}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {icon && (
        <div className={`p-2.5 rounded-lg ${iconBg} shrink-0`}>{icon}</div>
      )}
    </div>
  );
};
