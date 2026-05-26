interface AlertProps {
  type: "error" | "success" | "info";
  message: string;
}

const styles = {
  error: "bg-rose-500/10 border-rose-500/30 text-rose-300",
  success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  info: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

const icons = { error: "⚠️", success: "✓", info: "ℹ️" };

export function Alert({ type, message }: AlertProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${styles[type]}`}
      role="alert"
    >
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
