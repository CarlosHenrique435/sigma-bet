import Link from "next/link";
import { getAuthFromCookies } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameCard } from "@/components/ui/GameCard";
import { GAMES_CATALOG } from "@/lib/games";
import { INITIAL_BALANCE } from "@/lib/constants";

export default async function HomePage() {
  const auth = await getAuthFromCookies();

  return (
    <div className="bg-mesh min-h-screen">
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold">
              Σ
            </span>
            <span className="text-xl font-bold gradient-text">Sigma Bet</span>
          </div>
          <div className="flex gap-3">
            {auth ? (
              <Link href={auth.role === "ADMIN" ? "/admin" : "/dashboard"}>
                <Button>Meu painel</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button variant="gold">Cadastrar grátis</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-sm text-violet-300 mb-6">
            100% moedas virtuais · Sem dinheiro real
          </span>
          <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl">
            <span className="gradient-text">Jogue.</span>
            <br />
            <span className="text-white">Aposte. Divirta-se.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Plataforma premium de games com saldo demo. Cadastre-se e receba{" "}
            <strong className="text-amber-400">{INITIAL_BALANCE.toLocaleString("pt-BR")} moedas</strong>{" "}
            para começar — sem PIX, sem saque, sem risco financeiro.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {auth ? (
              <Link href={auth.role === "ADMIN" ? "/admin" : "/dashboard"}>
                <Button size="lg" variant="gold">
                  Ir para o painel →
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" variant="gold">
                    Começar agora — grátis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary">
                    Já tenho conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Jogos em destaque</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
          {GAMES_CATALOG.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "🪙", title: "Moedas virtuais", desc: "Saldo demo sem valor monetário real." },
            { icon: "🔒", title: "Seguro e justo", desc: "Resultados gerados no servidor, nunca no cliente." },
            { icon: "📊", title: "Histórico completo", desc: "Acompanhe apostas, lucros e transações." },
          ].map((item) => (
            <Card key={item.title}>
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600">
        Sigma Bet · Plataforma demonstrativa · Moedas fictícias
        {!auth && (
          <p className="mt-2">
            <Link href="/admin/login" className="text-slate-500 hover:text-violet-400">
              Acesso administrativo
            </Link>
          </p>
        )}
      </footer>
    </div>
  );
}
