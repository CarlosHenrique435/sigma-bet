interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  sub?: string;
}

export function StatCard({ label, value, icon, trend, sub }: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
        ? "text-rose-400"
        : "text-white";

  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
      <p className={`mt-2 text-2xl font-bold ${trendColor}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
