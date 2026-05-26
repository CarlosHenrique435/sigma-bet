"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GAMES_CATALOG } from "@/lib/games";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/wallet", label: "Carteira", icon: "💰" },
  { href: "/history", label: "Histórico", icon: "📊" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/50 lg:block">
      <nav className="flex h-full flex-col p-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        <ul className="space-y-1">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-violet-600/20 text-violet-300 shadow-sm shadow-violet-500/10"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mb-2 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Jogos
        </p>
        <ul className="space-y-1">
          {GAMES_CATALOG.map((game) => {
            const active = pathname.startsWith(game.href);
            return (
              <li key={game.slug}>
                <Link
                  href={game.isActive ? game.href : "#"}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-violet-600/20 text-violet-300"
                      : game.isActive
                        ? "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        : "text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <span>{game.icon}</span>
                  {game.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-500">Moedas virtuais</p>
          <p className="mt-1 text-xs text-slate-400">Sem valor real · Demo only</p>
        </div>
      </nav>
    </aside>
  );
}
