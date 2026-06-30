import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="mb-3 text-4xl">🧭</div>
        <h1 className="mb-1 text-lg font-semibold text-slate-900">Page not found</h1>
        <p className="mb-6 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="font-medium text-brand-600 hover:underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
