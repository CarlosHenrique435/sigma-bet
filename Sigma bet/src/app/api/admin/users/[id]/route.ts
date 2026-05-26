import { NextRequest } from "next/server";
import { requireAdmin, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";
import { getUserDetail } from "@/services/admin.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const detail = await getUserDetail(id);
    return jsonSuccess(detail);
  } catch (error) {
    return errorResponse(error);
  }
}
