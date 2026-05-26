import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { getAuthFromRequest, JwtPayload } from "./auth";
import { AppError } from "./errors";
export async function requireAuth(req: NextRequest): Promise<JwtPayload> {
  return getAuthFromRequest(req);
}

export async function requireAdmin(req: NextRequest): Promise<JwtPayload> {
  const auth = await getAuthFromRequest(req);
  if (auth.role !== Role.ADMIN) {
    throw new AppError("Acesso negado. Apenas administradores.", 403, "FORBIDDEN");
  }
  return auth;
}

export function jsonSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export async function parseBody<T>(req: NextRequest | Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new AppError("Corpo da requisição inválido", 400, "INVALID_BODY");
  }
}
