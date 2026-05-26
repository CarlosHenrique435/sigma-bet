import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { INITIAL_BALANCE } from "@/lib/constants";
import { signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { AppError, errorResponse } from "@/lib/errors";
import { jsonSuccess, parseBody } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await parseBody(req);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400, "VALIDATION_ERROR");
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("E-mail já cadastrado", 409, "EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        balance: INITIAL_BALANCE,
        role: Role.USER,
        transactions: {
          create: {
            type: "CREDIT",
            amount: INITIAL_BALANCE,
            description: "Saldo inicial de boas-vindas",
          },
        },
      },
    });

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
    }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
