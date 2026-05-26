import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(72, "Senha muito longa"),
  confirmPassword: z.string().optional(),
}).refine(
  (d) => !d.confirmPassword || d.password === d.confirmPassword,
  { message: "Senhas não conferem", path: ["confirmPassword"] }
);

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const coinflipSchema = z.object({
  choice: z.enum(["HEADS", "TAILS"], {
    errorMap: () => ({ message: "Escolha inválida" }),
  }),
  amount: z.coerce
    .number()
    .int("Valor deve ser inteiro")
    .positive("Valor deve ser maior que zero")
    .max(1_000_000, "Valor máximo excedido"),
});

export const adjustBalanceSchema = z.object({
  amount: z.coerce.number().int().min(0, "Valor inválido"),
  operation: z.enum(["add", "subtract", "set"]),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, "Nova senha: mínimo 6 caracteres")
    .max(72)
    .optional(),
}).refine(
  (d) => !d.newPassword || d.currentPassword,
  { message: "Informe a senha atual", path: ["currentPassword"] }
);

export const betFiltersSchema = z.object({
  game: z.string().optional(),
  status: z.enum(["WON", "LOST"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
