const VARIANTS = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Alert({ children, variant = "error", className = "" }) {
  if (!children) return null;
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${VARIANTS[variant]} ${className}`}>
      {children}
    </div>
  );
}
