import { Check, X } from "./icons";

const VARIANTS = {
  error: { wrap: "bg-red-50 text-red-700 border-red-100", icon: <X size={15} /> },
  success: { wrap: "bg-brand-50 text-brand-800 border-brand-100", icon: <Check size={15} /> },
  info: { wrap: "bg-ink-100 text-ink-700 border-ink-200", icon: null },
};

export default function Alert({ children, variant = "error", className = "" }) {
  if (!children) return null;
  const v = VARIANTS[variant];
  return (
    <div
      className={`flex animate-fade-up items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${v.wrap} ${className}`}
    >
      {v.icon && <span className="mt-0.5 shrink-0">{v.icon}</span>}
      <span>{children}</span>
    </div>
  );
}
