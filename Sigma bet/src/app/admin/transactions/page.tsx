import { AdminShell } from "@/components/layout/AdminShell";
import { AdminTransactionsTable } from "@/components/admin/AdminTransactionsTable";
import { requireAdminSession } from "@/lib/session";
import { getAllTransactions } from "@/services/admin.service";

export default async function AdminTransactionsPage() {
  const user = await requireAdminSession();
  const transactions = await getAllTransactions(100);

  return (
    <AdminShell
      user={user}
      title="Transações"
      subtitle="Movimentações de moedas virtuais"
    >
      <AdminTransactionsTable
        transactions={transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
