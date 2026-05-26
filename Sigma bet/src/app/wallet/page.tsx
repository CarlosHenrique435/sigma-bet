import { AppShell } from "@/components/layout/AppShell";
import { TransactionList } from "@/components/wallet/TransactionList";
import { Card } from "@/components/ui/Card";
import { requireUserSession } from "@/lib/session";
import { getTransactions } from "@/services/wallet.service";
import { formatCoins } from "@/lib/format";

export default async function WalletPage() {
  const user = await requireUserSession();
  const transactions = await getTransactions(user.id, { limit: 50 });

  const credits = transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((s, t) => s + t.amount, 0);
  const debits = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <AppShell
      user={user}
      title="Carteira"
      subtitle="Saldo virtual e movimentações — sem valor real"
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card glow className="sm:col-span-1">
          <p className="text-sm text-slate-400">Saldo atual</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{formatCoins(user.balance)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Total creditado</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">+{formatCoins(credits)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Total debitado</p>
          <p className="mt-2 text-2xl font-bold text-rose-400">-{formatCoins(debits)}</p>
        </Card>
      </div>

      <TransactionList
        transactions={transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
        }))}
      />
    </AppShell>
  );
}
