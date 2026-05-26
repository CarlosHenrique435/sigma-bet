import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { UserStats } from "@/types";

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
      role: true,
      isBlocked: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError("Usuário não encontrado", 404, "USER_NOT_FOUND");
  return user;
}

export async function requireActiveUser(id: string) {
  const user = await getUserById(id);
  if (user.isBlocked) {
    throw new AppError("Conta bloqueada. Entre em contato com o suporte.", 403, "USER_BLOCKED");
  }
  return user;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const [bets, wins, losses] = await Promise.all([
    prisma.bet.findMany({
      where: { userId },
      select: { amount: true, profit: true, status: true },
    }),
    prisma.bet.count({ where: { userId, status: "WON" } }),
    prisma.bet.count({ where: { userId, status: "LOST" } }),
  ]);

  const totalBets = bets.length;
  const totalWagered = bets.reduce((s, b) => s + b.amount, 0);
  const netProfit = bets.reduce((s, b) => s + b.profit, 0);
  const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;

  return {
    totalBets,
    totalWins: wins,
    totalLosses: losses,
    totalWagered,
    netProfit,
    winRate,
  };
}

export async function updateProfile(
  userId: string,
  data: { name?: string; currentPassword?: string; newPassword?: string }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  const updates: { name?: string; passwordHash?: string } = {};

  if (data.name) updates.name = data.name;

  if (data.newPassword) {
    if (!data.currentPassword) {
      throw new AppError("Senha atual obrigatória", 400);
    }
    const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!valid) throw new AppError("Senha atual incorreta", 400, "INVALID_PASSWORD");
    updates.passwordHash = await bcrypt.hash(data.newPassword, 12);
  }

  return prisma.user.update({
    where: { id: userId },
    data: updates,
    select: { id: true, name: true, email: true, balance: true, role: true },
  });
}
