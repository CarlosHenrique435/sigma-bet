import { CoinSide } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { flipCoin, resolveCoinflip } from "@/lib/game";
import { COIN_LABELS } from "@/lib/game";

export async function playCoinflip(userId: string, choice: CoinSide, amount: number) {
  const game = await prisma.game.findUnique({ where: { slug: "coinflip" } });
  if (!game?.isActive) {
    throw new AppError("Jogo indisponível no momento", 400, "GAME_INACTIVE");
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("Usuário não encontrado", 404);
    if (user.isBlocked) {
      throw new AppError("Conta bloqueada", 403, "USER_BLOCKED");
    }
    if (user.balance < amount) {
      throw new AppError("Saldo insuficiente", 400, "INSUFFICIENT_BALANCE");
    }

    const coinResult = flipCoin();
    const { status, profit, winAmount } = resolveCoinflip(choice, coinResult, amount);
    const newBalance =
      status === "WON" ? user.balance - amount + winAmount : user.balance - amount;

    if (newBalance < 0) {
      throw new AppError("Saldo negativo não permitido", 400, "NEGATIVE_BALANCE");
    }

    await tx.user.update({ where: { id: userId }, data: { balance: newBalance } });

    await tx.transaction.create({
      data: {
        userId,
        type: "DEBIT",
        amount,
        description: `Aposta Coinflip — ${COIN_LABELS[choice]}`,
      },
    });

    if (status === "WON") {
      await tx.transaction.create({
        data: {
          userId,
          type: "CREDIT",
          amount: winAmount,
          description: `Ganho Coinflip — ${COIN_LABELS[coinResult]}`,
        },
      });
    }

    const bet = await tx.bet.create({
      data: {
        userId,
        gameId: game.id,
        amount,
        choice,
        result: coinResult,
        profit,
        status,
      },
      include: { game: { select: { name: true, slug: true } } },
    });

    return { bet, balance: newBalance, coinResult, won: status === "WON", profit };
  });
}
