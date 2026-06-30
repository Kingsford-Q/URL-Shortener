export default function Toggle({ checked, onChange, label, description, icon }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-1">
      <span className="flex items-start gap-3">
        {icon && (
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              checked ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-400"
            }`}
          >
            {icon}
          </span>
        )}
        <span>
          <span className="block text-sm font-medium text-ink-800">{label}</span>
          {description && <span className="block text-xs text-ink-500">{description}</span>}
        </span>
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`h-6 w-10 rounded-full transition-colors duration-200 ${
            checked ? "bg-brand-600" : "bg-ink-200"
          }`}
        />
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </label>
  );
}
