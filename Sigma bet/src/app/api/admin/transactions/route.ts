import { NextRequest } from "next/server";
import { requireAdmin, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";
import { getAllTransactions } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const limit = Number(new URL(req.url).searchParams.get("limit") ?? 50);
    const transactions = await getAllTransactions(limit);
    return jsonSuccess({ transactions });
  } catch (error) {
    return errorResponse(error);
  }
}
