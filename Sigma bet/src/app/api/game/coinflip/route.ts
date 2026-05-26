import { NextRequest } from "next/server";
import { CoinSide } from "@prisma/client";
import { requireAuth, jsonSuccess, parseBody } from "@/lib/api";
import { coinflipSchema } from "@/lib/validations";
import { errorResponse, AppError } from "@/lib/errors";
import { requireActiveUser } from "@/services/user.service";
import { playCoinflip } from "@/services/game.service";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    await requireActiveUser(auth.sub);
    const body = await parseBody(req);
    const parsed = coinflipSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400, "VALIDATION_ERROR");
    }

    const result = await playCoinflip(
      auth.sub,
      parsed.data.choice as CoinSide,
      parsed.data.amount
    );

    return jsonSuccess(result);
  } catch (error) {
    return errorResponse(error);
  }
}
