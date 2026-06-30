import { useState } from "react";
import { Link } from "react-router-dom";
import { createLink } from "../api/links";
import { apiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { isValidUrl, normalizeUrl } from "../lib/format";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { BarChart, Copy, Globe, Lock, QrCode, Zap } from "../components/icons";

const FEATURES = [
  {
    icon: Lock,
    title: "Password and expiration",
    body: "Lock a link behind a password, set it to expire at a specific time, or burn it after a single click.",
  },
  {
    icon: BarChart,
    title: "Click analytics",
    body: "See clicks over time plus a breakdown by browser, OS, device, and referrer for every link you own.",
  },
  {
    icon: QrCode,
    title: "QR codes built in",
    body: "Every short link gets a QR code for free, downloadable as PNG or SVG, regenerated automatically.",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const url = normalizeUrl(originalUrl);
    setOriginalUrl(url);
    if (!isValidUrl(url)) {
      setError("Enter a valid URL, for example example.com/page or https://example.com/page.");
      return;
    }

    setLoading(true);
    try {
      const data = await createLink({ originalUrl: url });
      setResult(data);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <section className="relative grid items-center gap-12 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
        />

        <div className="relative animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <Zap size={12} />
            Links that hold up
          </span>
          <h1 className="mt-4 max-w-lg font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-ink-950 sm:text-5xl">
            Shorten a link in seconds, keep control of it forever
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-500">
            Custom aliases, password protection, expiration, one-time links, QR codes, and real click
            analytics. Paste a URL below and try it without an account.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex max-w-lg flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Input
                icon={Globe}
                placeholder="example.com/a-very-long-url"
                type="text"
                inputMode="url"
                autoComplete="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                onBlur={(e) => setOriginalUrl(normalizeUrl(e.target.value))}
              />
            </div>
            <Button type="submit" loading={loading} className="sm:w-auto">
              Shorten link
            </Button>
          </form>

          <div className="mt-3 max-w-lg">
            <Alert>{error}</Alert>
          </div>

          {result && (
            <div className="mt-3 flex max-w-lg animate-fade-up items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 p-3.5">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate font-mono text-sm font-medium text-brand-800 hover:underline"
              >
                {result.shortUrl}
              </a>
              <Button variant="secondary" size="sm" onClick={copy}>
                <Copy size={13} />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}

          {!user && (
            <p className="mt-7 text-sm text-ink-500">
              <Link to="/register" className="font-medium text-brand-700 hover:underline">
                Create a free account
              </Link>{" "}
              to manage links from a dashboard, set passwords, and track analytics.
            </p>
          )}
        </div>

        <div className="relative hidden animate-fade-up lg:block" style={{ animationDelay: "100ms" }}>
          <div className="absolute -right-6 -top-6 h-full w-full rotate-3 rounded-3xl bg-ink-100" />
          <div className="relative rounded-3xl border border-ink-100 bg-white p-5 shadow-lifted">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <span className="font-mono text-xs text-ink-400">urlshortener.pro/launch-q3</span>
              <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
                Active
              </span>
            </div>
            <p className="mt-3 truncate text-xs text-ink-400">→ company.com/blog/q3-product-launch-notes</p>
            <div className="mt-4 flex items-end gap-1.5">
              {[14, 22, 18, 30, 26, 38, 31, 44].map((h, i) => (
                <div key={i} className="w-full rounded-t-sm bg-brand-200" style={{ height: `${h}px` }} />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-sm">
              <div>
                <div className="font-mono text-lg font-semibold tabular-nums text-ink-950">1,284</div>
                <div className="text-[11px] text-ink-400">clicks this week</div>
              </div>
              <div className="grid h-12 w-12 grid-cols-3 gap-0.5 rounded-lg bg-ink-950 p-1.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-[1px] ${[0, 2, 4, 6, 8].includes(i) ? "bg-white" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-ink-100 bg-ink-100 sm:grid-cols-3">
        {FEATURES.map(({ icon: FeatureIcon, title, body }) => (
          <div key={title} className="bg-ink-50/60 p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-700 shadow-soft">
              <FeatureIcon size={17} />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-ink-900">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
