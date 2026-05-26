"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { HistoryTable } from "@/components/history/HistoryTable";
import { TransactionList } from "@/components/wallet/TransactionList";
import { apiFetch } from "@/lib/fetch-client";
import { formatCoins } from "@/lib/format";
import type { BetWithGame, TransactionItem } from "@/types";

interface AdminUserDetailProps {
  user: {
    id: string;
    name: string;
    email: string;
    balance: number;
    role: string;
    isBlocked: boolean;
    createdAt: string;
    _count: { bets: number };
  };
  bets: BetWithGame[];
  transactions: TransactionItem[];
  stats: {
    _count: { _all: number };
    _sum: { amount: number | null; profit: number | null };
  };
}

export function AdminUserDetail({ user: initialUser, bets, transactions, stats }: AdminUserDetailProps) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [amount, setAmount] = useState(String(user.balance));
  const [loading, setLoading] = useState(false);

  async function adjustBalance(operation: "add" | "subtract" | "set") {
    const val = parseInt(amount, 10);
    if (isNaN(val) || val < 0) return;
    setLoading(true);
    const res = await apiFetch<{ user: { balance: number } }>(
      `/api/admin/users/${user.id}/balance`,
      { method: "PATCH", body: JSON.stringify({ amount: val, operation }) }
    );
    setLoading(false);
    if (res.success && res.data) {
      setUser((u) => ({ ...u, balance: res.data!.user.balance }));
      router.refresh();
    }
  }

  async function toggleBlock() {
    setLoading(true);
    const res = await apiFetch<{ user: { isBlocked: boolean } }>(
      `/api/admin/users/${user.id}/block`,
      { method: "PATCH", body: JSON.stringify({ isBlocked: !user.isBlocked }) }
    );
    setLoading(false);
    if (res.success && res.data) {
      setUser((u) => ({ ...u, isBlocked: res.data!.user.isBlocked }));
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Saldo" value={formatCoins(user.balance)} icon="💰" />
        <StatCard label="Apostas" value={stats._count._all} icon="🎲" />
        <StatCard
          label="Lucro do jogador"
          value={`${(stats._sum.profit ?? 0) >= 0 ? "+" : ""}${formatCoins(stats._sum.profit ?? 0)}`}
          trend={(stats._sum.profit ?? 0) >= 0 ? "up" : "down"}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant={user.isBlocked ? "danger" : "success"}>
              {user.isBlocked ? "Bloqueado" : "Ativo"}
            </Badge>
            <p className="mt-2 text-sm text-slate-400">Role: {user.role}</p>
          </div>
          {user.role !== "ADMIN" && (
            <Button
              variant={user.isBlocked ? "primary" : "danger"}
              onClick={toggleBlock}
              loading={loading}
            >
              {user.isBlocked ? "Desbloquear" : "Bloquear"}
            </Button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <Input
            label="Ajustar saldo (moedas)"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => adjustBalance("add")} loading={loading} size="sm">
            + Adicionar
          </Button>
          <Button variant="danger" onClick={() => adjustBalance("subtract")} loading={loading} size="sm">
            − Remover
          </Button>
          <Button variant="secondary" onClick={() => adjustBalance("set")} loading={loading} size="sm">
            = Definir
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Últimas apostas</h3>
        <HistoryTable bets={bets} />
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}
