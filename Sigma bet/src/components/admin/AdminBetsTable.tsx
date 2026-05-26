import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { COIN_LABELS } from "@/lib/game";
import { formatCoins, formatDate } from "@/lib/format";
import type { CoinSide, BetStatus } from "@prisma/client";

interface AdminBetRow {
  id: string;
  amount: number;
  choice: CoinSide;
  result: CoinSide;
  profit: number;
  status: BetStatus;
  createdAt: string;
  user: { name: string; email: string };
  game: { name: string };
}

interface AdminBetsTableProps {
  bets: AdminBetRow[];
}

export function AdminBetsTable({ bets }: AdminBetsTableProps) {
  return (
    <Card padding="sm">
      {bets.length === 0 ? (
        <p className="py-12 text-center text-slate-500">Nenhuma aposta.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Jogo</th>
                <th className="px-4 py-3">Aposta</th>
                <th className="px-4 py-3 hidden lg:table-cell">Escolha</th>
                <th className="px-4 py-3 hidden lg:table-cell">Resultado</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lucro</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => (
                <tr key={bet.id} className="border-b border-slate-800/50">
                  <td className="px-4 py-3">
                    <p className="text-white">{bet.user.name}</p>
                    <p className="text-xs text-slate-500">{bet.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{bet.game.name}</td>
                  <td className="px-4 py-3">{formatCoins(bet.amount)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-400">
                    {COIN_LABELS[bet.choice]}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-400">
                    {COIN_LABELS[bet.result]}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={bet.status === "WON" ? "success" : "danger"}>
                      {bet.status === "WON" ? "Vitória" : "Derrota"}
                    </Badge>
                  </td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      bet.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {bet.profit >= 0 ? "+" : ""}
                    {formatCoins(bet.profit)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(bet.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
