import { ChevronDown } from "./icons";

export default function Select({ className = "", children, ...rest }) {
  return (
    <div className="relative inline-flex">
      <select
        className={`appearance-none rounded-xl border border-ink-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-ink-700 outline-none transition-colors duration-150 focus:border-brand-500 ${className}`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
    </div>
  );
}
