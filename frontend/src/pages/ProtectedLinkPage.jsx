import { useState } from "react";
import { useParams } from "react-router-dom";
import { verifyLinkPassword } from "../api/redirect";
import { apiErrorMessage } from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";

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
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <div className="mb-2 text-3xl">🔒</div>
        <h1 className="mb-1 text-lg font-semibold text-slate-900">This link is password protected</h1>
        <p className="mb-4 text-sm text-slate-500">Enter the password to continue to your destination.</p>
        <form onSubmit={onSubmit} className="space-y-3 text-left">
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
