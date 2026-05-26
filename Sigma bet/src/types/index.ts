import type { BetStatus, CoinSide, Role, TransactionType } from "@prisma/client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: Role;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface JwtUser {
  sub: string;
  email: string;
  role: Role;
  name: string;
}

export interface BetWithGame {
  id: string;
  amount: number;
  choice: CoinSide;
  result: CoinSide;
  profit: number;
  status: BetStatus;
  createdAt: string;
  game: { name: string; slug: string };
}

export interface TransactionItem {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
}

export interface UserStats {
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  totalWagered: number;
  netProfit: number;
  winRate: number;
}

export interface GameInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  href: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBets: number;
  totalVolume: number;
  platformNetProfit: number;
  activeUsers: number;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
  _count: { bets: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
