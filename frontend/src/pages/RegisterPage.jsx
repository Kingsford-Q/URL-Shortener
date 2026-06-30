import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { Link2 } from "../components/icons";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm animate-fade-up py-6">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-brand-50">
        <Link2 size={20} strokeWidth={2} />
      </span>
      <h1 className="mt-4 text-center font-display text-2xl font-semibold text-ink-950">Create an account</h1>
      <p className="mt-1 text-center text-sm text-ink-500">Free, no card required</p>

      <form
        onSubmit={onSubmit}
        className="mt-7 space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
      >
        <Alert>{error}</Alert>
        <Input label="Name" name="name" required value={form.name} onChange={onChange} autoComplete="name" />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Sign up
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
