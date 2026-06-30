import { useState } from "react";
import { Link } from "react-router-dom";
import { createLink } from "../api/links";
import { apiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";

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
    setLoading(true);
    try {
      const data = await createLink({ originalUrl });
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
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">Shorten links that work harder</h1>
      <p className="mt-3 text-slate-500">
        Custom aliases, password protection, expiration, QR codes and click analytics — all in one place.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex gap-2 text-left">
        <div className="flex-1">
          <Input
            placeholder="https://example.com/a-very-long-url"
            type="url"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </div>
        <Button type="submit" loading={loading}>
          Shorten
        </Button>
      </form>

      <div className="mt-4 text-left">
        <Alert>{error}</Alert>
      </div>

      {result && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left">
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate font-medium text-brand-700 hover:underline"
          >
            {result.shortUrl}
          </a>
          <Button variant="secondary" onClick={copy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}

      {!user && (
        <p className="mt-8 text-sm text-slate-500">
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Create a free account
          </Link>{" "}
          to manage your links, set passwords, track analytics, and generate QR codes.
        </p>
      )}
    </div>
  );
}
