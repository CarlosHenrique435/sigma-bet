import { NextRequest } from "next/server";
import { BetStatus } from "@prisma/client";
import { requireAuth, jsonSuccess } from "@/lib/api";
import { errorResponse, AppError } from "@/lib/errors";
import { betFiltersSchema } from "@/lib/validations";
import { requireActiveUser } from "@/services/user.service";
import { getBets } from "@/services/bet.service";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    await requireActiveUser(auth.sub);
    const { searchParams } = new URL(req.url);

    const parsed = betFiltersSchema.safeParse({
      game: searchParams.get("game") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      limit: searchParams.get("limit") ?? 20,
    });

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { game, status, from, to, limit } = parsed.data;

    const bets = await getBets({
      userId: auth.sub,
      gameSlug: game,
      status: status as BetStatus | undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      limit,
    });

    return jsonSuccess({ bets });
  } catch (error) {
    return errorResponse(error);
  }
}
