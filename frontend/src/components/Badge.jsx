const TONES = {
  brand: "bg-brand-100 text-brand-700",
  amber: "bg-amber-100 text-amber-800",
  ink: "bg-ink-100 text-ink-600",
  red: "bg-red-100 text-red-700",
};

export default function Badge({ tone = "ink", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
