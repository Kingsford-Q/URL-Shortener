import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white shadow-brand-glow hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-300 disabled:shadow-none",
  secondary:
    "bg-white text-ink-700 border border-ink-200 shadow-soft hover:border-ink-300 hover:bg-ink-50 active:scale-[0.98] disabled:text-ink-300",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 active:scale-[0.98] disabled:text-red-300",
  ghost: "text-ink-500 hover:bg-ink-100 hover:text-ink-800 active:scale-[0.98] disabled:text-ink-300",
};

const SIZES = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Spinner className="h-3.5 w-3.5 border-current/30 border-t-current" />}
      {children}
    </button>
  );
}
