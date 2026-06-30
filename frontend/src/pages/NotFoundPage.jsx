import { Link } from "react-router-dom";
import { Compass } from "../components/icons";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-sm animate-fade-up py-6 text-center">
      <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-600">
          <Compass size={20} />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-ink-950">Page not found</h1>
        <p className="mt-1.5 text-sm text-ink-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
