"use client";

import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export interface HistoryFilterValues {
  game: string;
  status: string;
  from: string;
  to: string;
}

interface HistoryFiltersProps {
  filters: HistoryFilterValues;
  onChange: (f: HistoryFilterValues) => void;
  onApply: () => void;
  loading?: boolean;
}

export function HistoryFilters({
  filters,
  onChange,
  onApply,
  loading,
}: HistoryFiltersProps) {
  return (
    <div className="glass-card rounded-2xl p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Select
        label="Jogo"
        value={filters.game}
        onChange={(e) => onChange({ ...filters, game: e.target.value })}
      >
        <option value="">Todos</option>
        <option value="coinflip">Coinflip</option>
      </Select>
      <Select
        label="Resultado"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">Todos</option>
        <option value="WON">Vitórias</option>
        <option value="LOST">Derrotas</option>
      </Select>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">De</label>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
          className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-white"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Até</label>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
          className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-white"
        />
      </div>
      <div className="flex items-end">
        <Button onClick={onApply} loading={loading} className="w-full">
          Filtrar
        </Button>
      </div>
    </div>
  );
}
