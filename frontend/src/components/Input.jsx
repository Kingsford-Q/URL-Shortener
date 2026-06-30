export default function Input({ label, error, icon: IconComp, className = "", id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && <span className="mb-1.5 block font-medium text-ink-700">{label}</span>}
      <span className="relative block">
        {IconComp && (
          <IconComp
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl border bg-white py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors duration-150 ${
            IconComp ? "pl-9 pr-3.5" : "px-3.5"
          } ${
            error ? "border-red-300 focus:border-red-400" : "border-ink-200 focus:border-brand-500"
          } ${className}`}
          {...rest}
        />
      </span>
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
