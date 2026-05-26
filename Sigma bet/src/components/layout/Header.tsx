"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { formatCoins } from "@/lib/format";
import { apiFetch } from "@/lib/fetch-client";
import type { AuthUser } from "@/types";

interface HeaderProps {
  user: AuthUser;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push(user.role === "ADMIN" ? "/admin/login" : "/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
          <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold">
              Σ
            </span>
            <span className="hidden font-bold gradient-text sm:inline">Sigma Bet</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user.role !== "ADMIN" && (
            <Link
              href="/wallet"
              className="hidden items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 sm:flex hover:bg-amber-500/20 transition-colors"
            >
              <span className="text-amber-400">🪙</span>
              <span className="font-bold text-amber-300">{formatCoins(user.balance)}</span>
            </Link>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-1.5 hover:border-violet-500/50 transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/30 text-sm font-bold text-violet-300">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-[120px] truncate text-sm text-slate-300 md:inline">
                {user.name}
              </span>
              <span className="text-slate-500 text-xs">▼</span>
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl">
                  {user.role !== "ADMIN" && (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                        onClick={() => setProfileOpen(false)}
                      >
                        Meu perfil
                      </Link>
                      <Link
                        href="/wallet"
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 sm:hidden"
                        onClick={() => setProfileOpen(false)}
                      >
                        Carteira
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-slate-800"
                  >
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen && user.role !== "ADMIN" && (
        <nav className="border-t border-slate-800 px-4 py-3 lg:hidden">
          {[
            { href: "/dashboard", label: "Dashboard", icon: "🏠" },
            { href: "/game/coinflip", label: "Coinflip", icon: "🪙" },
            { href: "/wallet", label: "Carteira", icon: "💰" },
            { href: "/history", label: "Histórico", icon: "📊" },
            { href: "/profile", label: "Perfil", icon: "👤" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                pathname.startsWith(item.href)
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-slate-400"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
