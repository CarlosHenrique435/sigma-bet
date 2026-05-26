import { BetStatus, CoinSide } from "@prisma/client";

export function flipCoin(): CoinSide {
  return Math.random() < 0.5 ? CoinSide.HEADS : CoinSide.TAILS;
}

export function resolveCoinflip(
  choice: CoinSide,
  result: CoinSide,
  amount: number
): { status: BetStatus; profit: number; winAmount: number } {
  const won = choice === result;

  if (won) {
    const winAmount = amount * 2;
    return {
      status: BetStatus.WON,
      profit: amount,
      winAmount,
    };
  }

  return {
    status: BetStatus.LOST,
    profit: -amount,
    winAmount: 0,
  };
}

export const COIN_LABELS: Record<CoinSide, string> = {
  HEADS: "Cara",
  TAILS: "Coroa",
};
