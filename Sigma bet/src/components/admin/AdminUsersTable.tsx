"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/fetch-client";
import { formatCoins, formatDate } from "@/lib/format";
import type { AdminUserRow } from "@/types";

interface AdminUsersTableProps {
  users: AdminUserRow[];
}

export function AdminUsersTable({ users: initialUsers }: AdminUsersTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [balanceValue, setBalanceValue] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function adjustBalance(userId: string, operation: "add" | "subtract" | "set") {
    const amount = parseInt(balanceValue, 10);
    if (isNaN(amount) || amount < 0) return;
    if (operation !== "set" && amount <= 0) return;

    setLoading(userId);
    const res = await apiFetch<{ user: { balance: number } }>(
      `/api/admin/users/${userId}/balance`,
      { method: "PATCH", body: JSON.stringify({ amount, operation }) }
    );
    setLoading(null);

    if (res.success && res.data) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, balance: res.data!.user.balance } : u
        )
      );
      setMessage("Saldo atualizado");
      setEditingId(null);
      router.refresh();
    }
  }

  async function toggleBlock(userId: string, isBlocked: boolean) {
    setLoading(userId);
    const res = await apiFetch<{ user: { isBlocked: boolean } }>(
      `/api/admin/users/${userId}/block`,
      { method: "PATCH", body: JSON.stringify({ isBlocked }) }
    );
    setLoading(null);
    if (res.success && res.data) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBlocked: res.data!.user.isBlocked } : u
        )
      );
      router.refresh();
    }
  }

  return (
    <Card padding="sm">
      {message && (
        <p className="mb-4 text-sm text-emerald-400">{message}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-500">
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Saldo</th>
              <th className="px-4 py-3 hidden md:table-cell">Apostas</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="font-medium text-white hover:text-violet-300"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="text-xs text-slate-600">{formatDate(user.createdAt)}</p>
                </td>
                <td className="px-4 py-3 font-bold text-amber-400">
                  {formatCoins(user.balance)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-400">
                  {user._count.bets}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.isBlocked ? "danger" : "success"}>
                    {user.isBlocked ? "Bloqueado" : "Ativo"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {editingId === user.id ? (
                    <div className="flex min-w-[200px] flex-col gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={balanceValue}
                        onChange={(e) => setBalanceValue(e.target.value)}
                        placeholder="Valor"
                      />
                      <div className="flex flex-wrap gap-1">
                        <Button size="sm" onClick={() => adjustBalance(user.id, "add")} loading={loading === user.id}>+</Button>
                        <Button size="sm" variant="danger" onClick={() => adjustBalance(user.id, "subtract")} loading={loading === user.id}>-</Button>
                        <Button size="sm" variant="secondary" onClick={() => adjustBalance(user.id, "set")} loading={loading === user.id}>=</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>✕</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(user.id);
                          setBalanceValue(String(user.balance));
                        }}
                      >
                        Saldo
                      </Button>
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant={user.isBlocked ? "primary" : "danger"}
                          onClick={() => toggleBlock(user.id, !user.isBlocked)}
                          loading={loading === user.id}
                        >
                          {user.isBlocked ? "Desbloquear" : "Bloquear"}
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
