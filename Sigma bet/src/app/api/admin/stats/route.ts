import { NextRequest } from "next/server";
import { requireAdmin, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";
import { getAdminStats } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const stats = await getAdminStats();
    return jsonSuccess({ stats });
  } catch (error) {
    return errorResponse(error);
  }
}
