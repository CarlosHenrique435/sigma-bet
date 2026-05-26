import { prisma } from "@/lib/prisma";
import type { AdminStats } from "@/types";

export async function getAdminStats(): Promise<AdminStats> {
  const [totalUsers, totalBets, volume, profitAgg, activeUsers] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.bet.count(),
    prisma.bet.aggregate({ _sum: { amount: true } }),
    prisma.bet.aggregate({ _sum: { profit: true } }),
    prisma.user.count({
      where: {
        role: "USER",
        isBlocked: false,
        bets: { some: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      },
    }),
  ]);

  return {
    totalUsers,
    totalBets,
    totalVolume: volume._sum.amount ?? 0,
    platformNetProfit: -(profitAgg._sum.profit ?? 0),
    activeUsers,
  };
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      _count: { select: { bets: true, transactions: true } },
    },
  });
}

export async function getUserDetail(userId: string) {
  const [user, bets, transactions, stats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        _count: { select: { bets: true } },
      },
    }),
    prisma.bet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { game: { select: { name: true, slug: true } } },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.bet.aggregate({
      where: { userId },
      _sum: { amount: true, profit: true },
      _count: { _all: true },
    }),
  ]);

  return { user, bets, transactions, stats };
}

export async function getAllTransactions(limit = 50) {
  return prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 100),
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}
