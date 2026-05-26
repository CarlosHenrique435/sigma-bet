"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { apiFetch } from "@/lib/fetch-client";
import { loginSchema } from "@/lib/validations";

export function AdminAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const res = await apiFetch<{ user: { role: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.success || !res.data) {
      setLoading(false);
      setError(res.error ?? "Credenciais inválidas");
      return;
    }

    if (res.data.user.role !== "ADMIN") {
      await apiFetch("/api/auth/logout", { method: "POST" });
      setLoading(false);
      setError("Esta conta não possui permissão de administrador.");
      return;
    }

    setLoading(false);
    router.push("/admin");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md border-violet-500/30">
      <div className="mb-2 text-center text-3xl">🛡️</div>
      <h1 className="mb-6 text-center text-2xl font-bold">Painel Administrativo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Alert type="error" message={error} />}
        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        <Link href="/login" className="text-violet-400 hover:underline">
          ← Login de usuário
        </Link>
      </p>
    </Card>
  );
}
