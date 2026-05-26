"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { apiFetch } from "@/lib/fetch-client";
import { registerSchema, loginSchema } from "@/lib/validations";
import { INITIAL_BALANCE } from "@/lib/constants";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blocked = searchParams.get("blocked") === "1";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState(blocked ? "Sua conta foi bloqueada." : "");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setErrors({});

    const schema = mode === "login" ? loginSchema : registerSchema;
    const data =
      mode === "login"
        ? { email, password }
        : { name, email, password, confirmPassword };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0]?.toString() ?? "form";
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await apiFetch<{ user: { role: string } }>(endpoint, {
      method: "POST",
      body: JSON.stringify(
        mode === "login"
          ? { email, password }
          : { name, email, password }
      ),
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error ?? "Erro ao autenticar");
      return;
    }

    if (mode === "register") {
      setSuccess(`Conta criada! Você recebeu ${INITIAL_BALANCE} moedas virtuais.`);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
      return;
    }

    const redirect = searchParams.get("redirect");
    const defaultDest = res.data?.user.role === "ADMIN" ? "/admin" : "/dashboard";
    router.push(redirect && redirect.startsWith("/") ? redirect : defaultDest);
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md gradient-border">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {mode === "login" ? "Entrar na conta" : "Criar conta"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <Input
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Seu nome"
          />
        )}
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="seu@email.com"
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Mínimo 6 caracteres"
        />
        {mode === "register" && (
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        )}

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <Button type="submit" className="w-full" variant="gold" loading={loading}>
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {mode === "login" ? (
          <>
            Não tem conta?{" "}
            <Link href="/register" className="text-violet-400 hover:underline">
              Cadastre-se grátis
            </Link>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <Link href="/login" className="text-violet-400 hover:underline">
              Entrar
            </Link>
          </>
        )}
      </p>
    </Card>
  );
}
