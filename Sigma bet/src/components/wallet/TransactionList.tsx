import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCoins, formatDate } from "@/lib/format";
import type { TransactionItem } from "@/types";

interface TransactionListProps {
  transactions: TransactionItem[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-white">Histórico de transações</h2>
      {transactions.length === 0 ? (
        <p className="py-8 text-center text-slate-500">Nenhuma transação registrada.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/30 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{tx.description}</p>
                <p className="text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
              </div>
              <div className="text-right">
                <Badge variant={tx.type === "CREDIT" ? "success" : "danger"}>
                  {tx.type === "CREDIT" ? "Crédito" : "Débito"}
                </Badge>
                <p
                  className={`mt-1 font-bold ${
                    tx.type === "CREDIT" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {formatCoins(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
