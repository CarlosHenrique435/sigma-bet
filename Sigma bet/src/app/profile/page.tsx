import { AppShell } from "@/components/layout/AppShell";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { requireUserSession } from "@/lib/session";

export default async function ProfilePage() {
  const user = await requireUserSession();

  return (
    <AppShell user={user} title="Meu perfil" subtitle="Gerencie seus dados da conta">
      <ProfileForm initialName={user.name} email={user.email} />
    </AppShell>
  );
}
