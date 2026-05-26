import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export async function getTransactions(
  userId: string,
  options?: { limit?: number; type?: TransactionType }
) {
  const limit = Math.min(options?.limit ?? 50, 100);
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(options?.type ? { type: options.type } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function adjustBalance(
  userId: string,
  amount: number,
  operation: "add" | "subtract" | "set",
  description?: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  let newBalance: number;
  let txType: TransactionType;
  let txAmount: number;
  let desc: string;

  switch (operation) {
    case "add":
      newBalance = user.balance + amount;
      txType = "CREDIT";
      txAmount = amount;
      desc = description ?? "Crédito de moedas virtuais";
      break;
    case "subtract":
      newBalance = user.balance - amount;
      if (newBalance < 0) throw new AppError("Saldo não pode ficar negativo", 400);
      txType = "DEBIT";
      txAmount = amount;
      desc = description ?? "Débito de moedas virtuais";
      break;
    case "set":
      if (amount < 0) throw new AppError("Saldo não pode ser negativo", 400);
      const diff = amount - user.balance;
      if (diff === 0) return user;
      newBalance = amount;
      txType = diff > 0 ? "CREDIT" : "DEBIT";
      txAmount = Math.abs(diff);
      desc = description ?? `Saldo ajustado para ${amount} moedas`;
      break;
    default:
      throw new AppError("Operação inválida", 400);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
    await tx.transaction.create({
      data: { userId, type: txType, amount: txAmount, description: desc },
    });
    return updated;
  });
}
