import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
    });

    return jsonSuccess({ users });
  } catch (error) {
    return errorResponse(error);
  }
}
