export default function Input({ label, error, className = "", id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && <span className="mb-1 block font-medium text-slate-700">{label}</span>}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand-200 ${
          error ? "border-red-400" : "border-slate-300 focus:border-brand-500"
        } ${className}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
