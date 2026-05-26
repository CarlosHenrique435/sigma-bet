import { HistoryPageClient } from "@/components/history/HistoryPageClient";
import { AppShell } from "@/components/layout/AppShell";
import { requireUserSession } from "@/lib/session";
import { getBets } from "@/services/bet.service";

export default async function HistoryPage() {
  const user = await requireUserSession();
  const bets = await getBets({ userId: user.id, limit: 50 });

  return (
    <AppShell
      user={user}
      title="Histórico"
      subtitle="Todas as suas apostas e resultados"
    >
      <HistoryPageClient
        initialBets={bets.map((b) => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
        }))}
      />
    </AppShell>
  );
}
