import { BetStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface BetFilters {
  userId?: string;
  gameSlug?: string;
  status?: BetStatus;
  from?: Date;
  to?: Date;
  limit?: number;
}

export async function getBets(filters: BetFilters) {
  const limit = Math.min(filters.limit ?? 20, 100);

  const where: Prisma.BetWhereInput = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.status) where.status = filters.status;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = filters.from;
    if (filters.to) where.createdAt.lte = filters.to;
  }
  if (filters.gameSlug) {
    where.game = { slug: filters.gameSlug };
  }

  return prisma.bet.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      game: { select: { name: true, slug: true } },
      ...(filters.userId
        ? {}
        : { user: { select: { id: true, name: true, email: true } } }),
    },
  });
}
