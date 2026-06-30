import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";

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
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Create an account</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
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
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
