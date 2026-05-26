import { NextRequest } from "next/server";
import { TransactionType } from "@prisma/client";
import { requireAuth, jsonSuccess } from "@/lib/api";
import { errorResponse } from "@/lib/errors";
import { requireActiveUser } from "@/services/user.service";
import { getTransactions } from "@/services/wallet.service";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    await requireActiveUser(auth.sub);
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? 50);
    const type = searchParams.get("type") as TransactionType | null;

    const transactions = await getTransactions(auth.sub, {
      limit,
      type: type === "CREDIT" || type === "DEBIT" ? type : undefined,
    });

    return jsonSuccess({ transactions });
  } catch (error) {
    return errorResponse(error);
  }
}
