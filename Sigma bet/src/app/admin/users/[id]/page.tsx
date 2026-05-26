import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminUserDetail } from "@/components/admin/AdminUserDetail";
import { requireAdminSession } from "@/lib/session";
import { getUserDetail } from "@/services/admin.service";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdminSession();
  const { id } = await params;
  const detail = await getUserDetail(id);

  if (!detail.user) notFound();

  return (
    <AdminShell
      user={admin}
      title={detail.user.name}
      subtitle={detail.user.email}
    >
      <Link
        href="/admin/users"
        className="mb-6 inline-block text-sm text-violet-400 hover:text-violet-300"
      >
        ← Voltar aos usuários
      </Link>
      <AdminUserDetail
        user={{
          ...detail.user,
          createdAt: detail.user.createdAt.toISOString(),
        }}
        bets={detail.bets.map((b) => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
        }))}
        transactions={detail.transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
        }))}
        stats={detail.stats}
      />
    </AdminShell>
  );
}
