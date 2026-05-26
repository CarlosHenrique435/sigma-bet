import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonSuccess, parseBody } from "@/lib/api";
import { AppError, errorResponse } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await params;
    const body = await parseBody<{ isBlocked: boolean }>(req);

    if (typeof body.isBlocked !== "boolean") {
      throw new AppError("isBlocked deve ser boolean", 400);
    }

    if (admin.sub === id) {
      throw new AppError("Não é possível bloquear sua própria conta", 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("Usuário não encontrado", 404, "USER_NOT_FOUND");
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isBlocked: body.isBlocked },
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
      },
    });

    return jsonSuccess({ user: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
