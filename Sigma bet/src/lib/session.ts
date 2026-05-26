import { redirect } from "next/navigation";
import { getAuthFromCookies } from "./auth";
import { getUserById } from "@/services/user.service";
import type { AuthUser } from "@/types";

export async function requireUserSession(): Promise<AuthUser> {
  const auth = await getAuthFromCookies();
  if (!auth) redirect("/login");
  if (auth.role === "ADMIN") redirect("/admin");

  const user = await getUserById(auth.sub);
  if (user.isBlocked) redirect("/login?blocked=1");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function requireAdminSession(): Promise<AuthUser> {
  const auth = await getAuthFromCookies();
  if (!auth) redirect("/admin/login");
  if (auth.role !== "ADMIN") redirect("/dashboard");

  const user = await getUserById(auth.sub);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance,
    role: user.role,
  };
}
