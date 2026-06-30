import { Link } from "react-router-dom";

const MESSAGES = {
  not_found: { icon: "🔍", title: "Link not found", body: "This short link doesn't exist." },
  disabled: { icon: "🚫", title: "Link disabled", body: "This short link has been disabled by its owner." },
  expired: { icon: "⏳", title: "Link expired", body: "This short link has expired and is no longer active." },
  used: { icon: "1️⃣", title: "Link already used", body: "This one-time link has already been used." },
};

export default function LinkStatusPage() {
  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason");
  const info = MESSAGES[reason] || {
    icon: "⚠️",
    title: "This link is unavailable",
    body: "We couldn't take you to your destination.",
  };

  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="mb-3 text-4xl">{info.icon}</div>
        <h1 className="mb-1 text-lg font-semibold text-slate-900">{info.title}</h1>
        <p className="mb-6 text-sm text-slate-500">{info.body}</p>
        <Link to="/" className="font-medium text-brand-600 hover:underline">
          Go to URL Shortener Pro
        </Link>
      </div>
    </div>
  );
}
