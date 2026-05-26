import { Header } from "./Header";
import { AdminSidebar } from "./AdminSidebar";
import type { AuthUser } from "@/types";

interface AdminShellProps {
  user: AuthUser;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminShell({ user, children, title, subtitle }: AdminShellProps) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-8">
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
