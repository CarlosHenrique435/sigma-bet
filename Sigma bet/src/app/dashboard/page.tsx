import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { GameCard } from "@/components/ui/GameCard";
import { Button } from "@/components/ui/Button";
import { RecentBets } from "@/components/dashboard/RecentBets";
import { requireUserSession } from "@/lib/session";
import { getUserStats } from "@/services/user.service";
import { getBets } from "@/services/bet.service";
import { GAMES_CATALOG } from "@/lib/games";
import { formatCoins, formatPercent } from "@/lib/format";

export default async function DashboardPage() {
  const user = await requireUserSession();
  const [stats, bets] = await Promise.all([
    getUserStats(user.id),
    getBets({ userId: user.id, limit: 5 }),
  ]);

  return (
    <AppShell
      user={user}
      title={`Olá, ${user.name.split(" ")[0]} 👋`}
      subtitle="Bem-vindo à sua central de jogos virtuais"
    >
      <div className="mb-8 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-transparent p-6 lg:p-8">
        <p className="text-sm text-slate-400">Saldo virtual</p>
        <p className="mt-1 text-4xl font-bold text-amber-400 lg:text-5xl">
          {formatCoins(user.balance)}
          <span className="ml-2 text-lg font-normal text-slate-500">moedas</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/game/coinflip">
            <Button variant="gold" size="lg">
              🪙 Jogar agora
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="secondary">💰 Carteira</Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de apostas" value={stats.totalBets} icon="🎲" />
        <StatCard
          label="Taxa de vitória"
          value={formatPercent(stats.winRate)}
          icon="🏆"
          trend={stats.winRate >= 50 ? "up" : "down"}
        />
        <StatCard label="Volume apostado" value={formatCoins(stats.totalWagered)} icon="📊" />
        <StatCard
          label="Lucro líquido"
          value={`${stats.netProfit >= 0 ? "+" : ""}${formatCoins(stats.netProfit)}`}
          icon="💎"
          trend={stats.netProfit >= 0 ? "up" : "down"}
        />
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Jogos disponíveis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES_CATALOG.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      <RecentBets
        bets={bets.map((b) => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
        }))}
      />
    </AppShell>
  );
}
