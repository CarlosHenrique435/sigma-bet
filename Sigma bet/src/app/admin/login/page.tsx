import Link from "next/link";
import { AdminAuthForm } from "@/components/auth/AdminAuthForm";

export default function AdminLoginPage() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold">
          Σ
        </span>
        <span className="text-xl font-bold gradient-text">Sigma Bet Admin</span>
      </Link>
      <AdminAuthForm />
      <p className="mt-6 text-center text-xs text-slate-500">
        Credenciais do seed: admin@sigmabet.com / Admin@123456
      </p>
    </div>
  );
}
