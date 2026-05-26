import { AdminShell } from "@/components/layout/AdminShell";
import { StatCard } from "@/components/ui/StatCard";
import { requireAdminSession } from "@/lib/session";
import { getAdminStats } from "@/services/admin.service";
import { formatCoins } from "@/lib/format";

export default async function AdminDashboardPage() {
  const user = await requireAdminSession();
  const stats = await getAdminStats();

  return (
    <AdminShell
      user={user}
      title="Dashboard Admin"
      subtitle="Visão geral da plataforma"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuários" value={stats.totalUsers} icon="👥" />
        <StatCard label="Usuários ativos (7d)" value={stats.activeUsers} icon="✨" sub="Com apostas recentes" />
        <StatCard label="Total de apostas" value={stats.totalBets} icon="🎲" />
        <StatCard
          label="Volume apostado"
          value={formatCoins(stats.totalVolume)}
          icon="📊"
          sub="Moedas virtuais"
        />
      </div>
      <div className="mt-6">
        <StatCard
          label="Lucro da plataforma"
          value={`${stats.platformNetProfit >= 0 ? "+" : ""}${formatCoins(stats.platformNetProfit)}`}
          icon="💰"
          sub="Soma inversa do lucro dos jogadores"
          trend={stats.platformNetProfit >= 0 ? "up" : "down"}
        />
      </div>
    </AdminShell>
  );
}
