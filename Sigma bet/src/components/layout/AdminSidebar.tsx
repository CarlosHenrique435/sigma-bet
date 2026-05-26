"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "📈", exact: true },
  { href: "/admin/users", label: "Usuários", icon: "👥" },
  { href: "/admin/bets", label: "Apostas", icon: "🎲" },
  { href: "/admin/transactions", label: "Transações", icon: "💳" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/50 lg:block">
      <nav className="flex h-full flex-col p-4">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-violet-400">
          Painel Admin
        </p>
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-violet-600/25 text-violet-300"
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
        <div className="mt-auto rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs font-semibold text-violet-400">Modo administrador</p>
          <p className="mt-1 text-xs text-slate-500">Gestão de moedas virtuais</p>
        </div>
      </nav>
    </aside>
  );
}
