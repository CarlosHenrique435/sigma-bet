import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { COIN_LABELS } from "@/lib/game";
import { formatCoins, formatDate } from "@/lib/format";
import type { BetWithGame } from "@/types";

interface RecentBetsProps {
  bets: BetWithGame[];
}

export function RecentBets({ bets }: RecentBetsProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Últimas apostas</h2>
        <Link href="/history" className="text-sm text-violet-400 hover:text-violet-300">
          Ver tudo →
        </Link>
      </div>
      {bets.length === 0 ? (
        <p className="py-8 text-center text-slate-500">Nenhuma aposta ainda.</p>
      ) : (
        <div className="space-y-3">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{bet.game.name}</p>
                <p className="text-xs text-slate-500">
                  {COIN_LABELS[bet.choice]} → {COIN_LABELS[bet.result]} · {formatDate(bet.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={bet.status === "WON" ? "success" : "danger"}>
                  {bet.status === "WON" ? "Vitória" : "Derrota"}
                </Badge>
                <p
                  className={`mt-1 text-sm font-bold ${
                    bet.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {bet.profit >= 0 ? "+" : ""}
                  {formatCoins(bet.profit)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
