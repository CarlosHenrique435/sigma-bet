import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCoins, formatDate } from "@/lib/format";
import type { TransactionType } from "@prisma/client";

interface AdminTransactionRow {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

interface AdminTransactionsTableProps {
  transactions: AdminTransactionRow[];
}

export function AdminTransactionsTable({ transactions }: AdminTransactionsTableProps) {
  return (
    <Card padding="sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-500">
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-800/50">
                <td className="px-4 py-3">
                  <p className="text-white">{tx.user.name}</p>
                  <p className="text-xs text-slate-500">{tx.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={tx.type === "CREDIT" ? "success" : "danger"}>
                    {tx.type === "CREDIT" ? "Crédito" : "Débito"}
                  </Badge>
                </td>
                <td
                  className={`px-4 py-3 font-bold ${
                    tx.type === "CREDIT" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {formatCoins(tx.amount)}
                </td>
                <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                  {tx.description}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(tx.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
