"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/fetch-client";
import { COIN_LABELS } from "@/lib/game";
import { formatCoins } from "@/lib/format";
import type { CoinSide } from "@prisma/client";

interface CoinflipGameProps {
  initialBalance: number;
}

type Phase = "idle" | "flipping" | "result";

export function CoinflipGame({ initialBalance }: CoinflipGameProps) {
  const router = useRouter();
  const [balance, setBalance] = useState(initialBalance);
  const [choice, setChoice] = useState<CoinSide | null>(null);
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [displaySide, setDisplaySide] = useState<CoinSide | null>(null);
  const [result, setResult] = useState<{
    coinResult: CoinSide;
    won: boolean;
    profit: number;
  } | null>(null);
  const [error, setError] = useState("");

  const isPlaying = phase !== "idle";

  const handlePlay = useCallback(async () => {
    if (isPlaying) return;
    if (!choice) {
      setError("Escolha cara ou coroa");
      return;
    }
    const betAmount = parseInt(amount, 10);
    if (!betAmount || betAmount <= 0) {
      setError("Informe um valor válido");
      return;
    }
    if (betAmount > balance) {
      setError("Saldo insuficiente");
      return;
    }

    setError("");
    setPhase("flipping");
    setResult(null);
    setDisplaySide(null);

    const res = await apiFetch<{
      balance: number;
      coinResult: CoinSide;
      won: boolean;
      bet: { profit: number };
    }>("/api/game/coinflip", {
      method: "POST",
      body: JSON.stringify({ choice, amount: betAmount }),
    });

    await new Promise((r) => setTimeout(r, 1200));

    if (!res.success || !res.data) {
      setPhase("idle");
      setError(res.error ?? "Erro ao processar aposta");
      return;
    }

    setDisplaySide(res.data.coinResult);
    setBalance(res.data.balance);
    setResult({
      coinResult: res.data.coinResult,
      won: res.data.won,
      profit: res.data.bet.profit,
    });
    setPhase("result");
    router.refresh();
  }, [isPlaying, choice, amount, balance, router]);

  function resetRound() {
    setPhase("idle");
    setResult(null);
    setDisplaySide(null);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card className="text-center gradient-border">
        <p className="text-sm text-slate-400">Saldo disponível</p>
        <p className="mt-1 text-4xl font-bold text-amber-400">{formatCoins(balance)}</p>
        <p className="text-xs text-slate-500">moedas virtuais</p>
      </Card>

      <Card glow={phase === "flipping"}>
        <div className="text-center">
          <Badge variant="gold">Ganhe 2x ao acertar</Badge>
          <h2 className="mt-4 text-xl font-bold">Coinflip</h2>
        </div>

        <div className="relative mx-auto my-8 flex h-40 w-40 items-center justify-center">
          <div
            className={`relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-violet-500/40 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 shadow-2xl shadow-violet-500/20 ${
              phase === "flipping" ? "animate-coin-flip" : phase === "result" ? "" : "animate-pulse-ring"
            }`}
          >
            <span className="text-6xl select-none">
              {phase === "flipping"
                ? "🪙"
                : displaySide
                  ? displaySide === "HEADS"
                    ? "👑"
                    : "🦅"
                  : "🪙"}
            </span>
          </div>
        </div>

        {phase === "result" && result && (
          <div
            className={`mb-6 rounded-2xl p-5 text-center animate-fade-up ${
              result.won
                ? "bg-emerald-500/15 border border-emerald-500/30"
                : "bg-rose-500/15 border border-rose-500/30"
            }`}
          >
            <p className="text-2xl">{result.won ? "🎉 Vitória!" : "😔 Derrota"}</p>
            <p className="mt-2 text-slate-300">
              Resultado: <strong>{COIN_LABELS[result.coinResult]}</strong>
            </p>
            <p
              className={`mt-2 text-xl font-bold ${
                result.profit >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {result.profit >= 0 ? "+" : ""}
              {formatCoins(result.profit)} moedas
            </p>
            <Button variant="ghost" size="sm" className="mt-4" onClick={resetRound}>
              Nova rodada
            </Button>
          </div>
        )}

        {phase !== "result" && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4">
              {(["HEADS", "TAILS"] as CoinSide[]).map((side) => (
                <button
                  key={side}
                  type="button"
                  disabled={isPlaying}
                  onClick={() => setChoice(side)}
                  className={`rounded-2xl border-2 p-5 transition-all duration-200 ${
                    choice === side
                      ? "border-violet-500 bg-violet-600/25 shadow-lg shadow-violet-500/20 scale-[1.02]"
                      : "border-slate-700 bg-slate-800/40 hover:border-slate-500"
                  } disabled:opacity-50`}
                >
                  <span className="text-4xl block">{side === "HEADS" ? "👑" : "🦅"}</span>
                  <span className="mt-2 block font-semibold">{COIN_LABELS[side]}</span>
                </button>
              ))}
            </div>

            <Input
              label="Valor da aposta"
              type="number"
              min={1}
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPlaying}
              placeholder="Ex: 100"
            />

            <div className="mt-3 flex gap-2">
              {[10, 25, 50, 100, 250].map((v) => (
                <button
                  key={v}
                  type="button"
                  disabled={isPlaying || balance < v}
                  onClick={() => setAmount(String(v))}
                  className="flex-1 rounded-lg bg-slate-800 py-2 text-xs text-slate-400 hover:bg-violet-600/20 hover:text-violet-300 disabled:opacity-40 transition-colors"
                >
                  {v}
                </button>
              ))}
              <button
                type="button"
                disabled={isPlaying}
                onClick={() => setAmount(String(balance))}
                className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/20 disabled:opacity-40"
              >
                MAX
              </button>
            </div>

            {error && (
              <div className="mt-4">
                <Alert type="error" message={error} />
              </div>
            )}

            <Button
              className="mt-6 w-full"
              size="lg"
              variant="gold"
              onClick={handlePlay}
              loading={phase === "flipping"}
              disabled={!choice || !amount || isPlaying}
            >
              {phase === "flipping" ? "Girando..." : "Apostar"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
