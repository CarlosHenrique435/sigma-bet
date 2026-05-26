"use client";

import { useState } from "react";
import { HistoryFilters, type HistoryFilterValues } from "./HistoryFilters";
import { HistoryTable } from "./HistoryTable";
import { apiFetch } from "@/lib/fetch-client";
import type { BetWithGame } from "@/types";

interface HistoryPageClientProps {
  initialBets: BetWithGame[];
}

export function HistoryPageClient({ initialBets }: HistoryPageClientProps) {
  const [bets, setBets] = useState(initialBets);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<HistoryFilterValues>({
    game: "",
    status: "",
    from: "",
    to: "",
  });

  async function applyFilters() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.game) params.set("game", filters.game);
    if (filters.status) params.set("status", filters.status);
    if (filters.from) params.set("from", new Date(filters.from).toISOString());
    if (filters.to) {
      const to = new Date(filters.to);
      to.setHours(23, 59, 59, 999);
      params.set("to", to.toISOString());
    }
    params.set("limit", "100");

    const res = await apiFetch<{ bets: BetWithGame[] }>(`/api/bets?${params}`);
    setLoading(false);
    if (res.success && res.data) {
      setBets(
        res.data.bets.map((b) => ({
          ...b,
          createdAt:
            typeof b.createdAt === "string"
              ? b.createdAt
              : new Date(b.createdAt).toISOString(),
        }))
      );
    }
  }

  return (
    <div className="space-y-6">
      <HistoryFilters
        filters={filters}
        onChange={setFilters}
        onApply={applyFilters}
        loading={loading}
      />
      <HistoryTable bets={bets} />
    </div>
  );
}
