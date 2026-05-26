import { AdminShell } from "@/components/layout/AdminShell";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { requireAdminSession } from "@/lib/session";
import { getAllUsers } from "@/services/admin.service";

export default async function AdminUsersPage() {
  const user = await requireAdminSession();
  const users = await getAllUsers();

  return (
    <AdminShell user={user} title="Usuários" subtitle="Gerenciar contas e saldos">
      <AdminUsersTable
        users={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
