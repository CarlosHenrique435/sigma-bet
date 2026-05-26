import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold">
          Σ
        </span>
        <span className="text-xl font-bold gradient-text">Sigma Bet</span>
      </Link>
      <Suspense fallback={<div className="text-slate-500">Carregando...</div>}>
        <AuthForm mode="login" />
      </Suspense>
      <p className="mt-6 text-sm text-slate-500">
        Administrador?{" "}
        <Link href="/admin/login" className="text-violet-400 hover:underline">
          Login admin
        </Link>
      </p>
    </div>
  );
}
