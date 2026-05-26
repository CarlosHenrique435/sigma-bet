import type { GameInfo } from "@/types";

export const GAMES_CATALOG: GameInfo[] = [
  {
    id: "coinflip",
    name: "Coinflip",
    slug: "coinflip",
    description: "Cara ou coroa — ganhe 2x ao acertar",
    icon: "🪙",
    isActive: true,
    href: "/game/coinflip",
  },
];

export function getGameBySlug(slug: string) {
  return GAMES_CATALOG.find((g) => g.slug === slug);
}
