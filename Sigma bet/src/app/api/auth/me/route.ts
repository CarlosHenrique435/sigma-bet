import { NextRequest } from "next/server";
import { requireAuth, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";
import { getUserById } from "@/services/user.service";
import { AppError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const user = await getUserById(auth.sub);

    if (user.isBlocked) {
      throw new AppError("Conta bloqueada", 403, "USER_BLOCKED");
    }

    return jsonSuccess({ user });
  } catch (error) {
    return errorResponse(error);
  }
}
