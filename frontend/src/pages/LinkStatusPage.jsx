import { Link } from "react-router-dom";
import { Ban, Compass, Hourglass, Zap } from "../components/icons";

const MESSAGES = {
  not_found: { Icon: Compass, title: "Link not found", body: "This short link doesn't exist." },
  disabled: { Icon: Ban, title: "Link disabled", body: "This short link has been disabled by its owner." },
  expired: { Icon: Hourglass, title: "Link expired", body: "This short link has expired and is no longer active." },
  used: { Icon: Zap, title: "Link already used", body: "This one-time link has already been used." },
};

export default function LinkStatusPage() {
  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason");
  const { Icon, title, body } = MESSAGES[reason] || {
    Icon: Ban,
    title: "This link is unavailable",
    body: "We couldn't take you to your destination.",
  };

  return (
    <div className="mx-auto max-w-sm animate-fade-up py-6 text-center">
      <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-600">
          <Icon size={20} />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-ink-950">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-500">{body}</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          Go to URL Shortener Pro
        </Link>
      </div>
    </div>
  );
}
