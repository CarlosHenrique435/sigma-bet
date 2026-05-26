import { clearAuthCookie } from "@/lib/auth";
import { jsonSuccess } from "@/lib/api";

export async function POST() {
  await clearAuthCookie();
  return jsonSuccess({ message: "Logout realizado" });
}
