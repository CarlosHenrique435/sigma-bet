interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "gold";
}

const variants = {
  default: "bg-slate-700/50 text-slate-300",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  gold: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
