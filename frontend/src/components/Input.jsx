export default function Input({ label, error, className = "", id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && <span className="mb-1.5 block font-medium text-ink-700">{label}</span>}
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors duration-150 ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-ink-200 focus:border-brand-500"
        } ${className}`}
        {...rest}
      />
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
