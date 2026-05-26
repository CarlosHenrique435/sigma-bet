import { AdminShell } from "@/components/layout/AdminShell";
import { AdminBetsTable } from "@/components/admin/AdminBetsTable";
import { requireAdminSession } from "@/lib/session";
import { getBets } from "@/services/bet.service";

export default async function AdminBetsPage() {
  const user = await requireAdminSession();
  const bets = await getBets({ limit: 100 });

  return (
    <AdminShell user={user} title="Apostas" subtitle="Histórico geral da plataforma">
      <AdminBetsTable
        bets={bets.map((b) => ({
          id: b.id,
          amount: b.amount,
          choice: b.choice,
          result: b.result,
          profit: b.profit,
          status: b.status,
          createdAt: b.createdAt.toISOString(),
          user: "user" in b && b.user ? b.user : { name: "—", email: "—" },
          game: b.game,
        }))}
      />
    </AdminShell>
  );
}
