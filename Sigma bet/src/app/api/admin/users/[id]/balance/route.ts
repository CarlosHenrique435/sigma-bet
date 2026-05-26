import { NextRequest } from "next/server";
import { requireAdmin, jsonSuccess, parseBody } from "@/lib/api";
import { adjustBalanceSchema } from "@/lib/validations";
import { errorResponse, AppError } from "@/lib/errors";
import { adjustBalance } from "@/services/wallet.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await parseBody(req);
    const parsed = adjustBalanceSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400, "VALIDATION_ERROR");
    }

    const { amount, operation } = parsed.data;

    if (operation === "set" && amount === 0) {
      // allow set to zero
    } else if (operation !== "set" && amount <= 0) {
      throw new AppError("Valor deve ser positivo", 400);
    }

    const user = await adjustBalance(
      id,
      amount,
      operation,
      "Ajuste manual pelo administrador"
    );

    return jsonSuccess({
      user: { id: user.id, name: user.name, email: user.email, balance: user.balance },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
