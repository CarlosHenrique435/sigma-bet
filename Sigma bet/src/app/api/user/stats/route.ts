import { NextRequest } from "next/server";
import { requireAuth, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";
import { getUserStats, requireActiveUser } from "@/services/user.service";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    await requireActiveUser(auth.sub);
    const stats = await getUserStats(auth.sub);
    return jsonSuccess({ stats });
  } catch (error) {
    return errorResponse(error);
  }
}
