"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { apiFetch } from "@/lib/fetch-client";

interface ProfileFormProps {
  initialName: string;
  email: string;
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Nova senha e confirmação não conferem");
      return;
    }

    setLoading(true);
    const res = await apiFetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: name !== initialName ? name : undefined,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      }),
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error ?? "Erro ao atualizar");
      return;
    }

    setSuccess("Perfil atualizado com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <Input label="E-mail" value={email} disabled className="opacity-60" />
        <Input
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
        <hr className="border-slate-800" />
        <p className="text-sm text-slate-400">Alterar senha (opcional)</p>
        <Input
          label="Senha atual"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label="Nova senha"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}
        <Button type="submit" loading={loading}>
          Salvar alterações
        </Button>
      </form>
    </Card>
  );
}
