import { AppShell } from "@/components/layout/AppShell";
import { CoinflipGame } from "@/components/game/CoinflipGame";
import { requireUserSession } from "@/lib/session";

export default async function CoinflipPage() {
  const user = await requireUserSession();

  return (
    <AppShell user={user} title="Coinflip" subtitle="Cara ou coroa — ganhe 2x ao acertar">
      <CoinflipGame initialBalance={user.balance} />
    </AppShell>
  );
}
