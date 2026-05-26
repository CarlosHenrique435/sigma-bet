import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { INITIAL_BALANCE } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold">
          Σ
        </span>
        <span className="text-xl font-bold gradient-text">Sigma Bet</span>
      </Link>
      <p className="mb-4 text-center text-sm text-amber-400/90">
        🎁 Ganhe {INITIAL_BALANCE.toLocaleString("pt-BR")} moedas ao se cadastrar
      </p>
      <Suspense fallback={<div className="text-slate-500">Carregando...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
