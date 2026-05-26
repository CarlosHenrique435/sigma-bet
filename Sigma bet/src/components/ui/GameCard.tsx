import Link from "next/link";
import type { GameInfo } from "@/types";
import { Badge } from "./Badge";

interface GameCardProps {
  game: GameInfo;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={game.isActive ? game.href : "#"}
      className={`group glass-card gradient-border block rounded-2xl p-6 transition-all duration-300 ${
        game.isActive
          ? "hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
          {game.icon}
        </span>
        <Badge variant={game.isActive ? "success" : "default"}>
          {game.isActive ? "Disponível" : "Em breve"}
        </Badge>
      </div>
      <h3 className="mt-4 text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
        {game.name}
      </h3>
      <p className="mt-1 text-sm text-slate-400">{game.description}</p>
      {game.isActive && (
        <p className="mt-4 text-sm font-semibold text-violet-400 group-hover:text-violet-300">
          Jogar agora →
        </p>
      )}
    </Link>
  );
}
