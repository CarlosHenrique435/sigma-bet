import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { AppError, errorResponse } from "@/lib/errors";
import { jsonSuccess, parseBody } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await parseBody(req);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400, "VALIDATION_ERROR");
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("E-mail ou senha incorretos", 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("E-mail ou senha incorretos", 401, "INVALID_CREDENTIALS");
    }

    if (user.isBlocked) {
      throw new AppError("Conta bloqueada", 403, "USER_BLOCKED");
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setAuthCookie(token);

    return jsonSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
