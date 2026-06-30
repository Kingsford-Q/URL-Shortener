import { useState } from "react";
import { useParams } from "react-router-dom";
import { verifyLinkPassword } from "../api/redirect";
import { apiErrorMessage } from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { Lock } from "../components/icons";

export default function ProtectedLinkPage() {
  const { shortCode } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const originalUrl = await verifyLinkPassword(shortCode, password);
      window.location.href = originalUrl;
    } catch (err) {
      setError(apiErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm animate-fade-up py-6">
      <div className="rounded-2xl border border-ink-100 bg-white p-7 text-center shadow-card">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 text-ink-600">
          <Lock size={18} />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-ink-950">This link is password protected</h1>
        <p className="mt-1 text-sm text-ink-500">Enter the password to continue to your destination.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3 text-left">
          <Alert>{error}</Alert>
          <Input
            type="password"
            label="Password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" loading={loading} className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
