import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { AuthUser } from "@/types";

interface AppShellProps {
  user: AuthUser;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ user, children, title, subtitle }: AppShellProps) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-8 animate-fade-up">
              {title && <h1 className="text-2xl font-bold text-white lg:text-3xl">{title}</h1>}
              {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
