import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "../api/admin";
import { apiErrorMessage } from "../api/client";
import { formatDate } from "../lib/format";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import Button from "../components/Button";

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const statsQuery = useQuery({ queryKey: ["admin", "stats"], queryFn: adminApi.fetchAdminStats });
  const usersQuery = useQuery({ queryKey: ["admin", "users"], queryFn: adminApi.fetchAdminUsers });

  const toggleUserMutation = useMutation({
    mutationFn: adminApi.toggleUserDisabled,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const onToggleUser = (user) => {
    setError("");
    toggleUserMutation.mutate(user.id);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Admin</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Users" value={statsQuery.data?.userCount ?? "—"} />
        <StatCard label="Links" value={statsQuery.data?.linkCount ?? "—"} />
        <StatCard label="Active links" value={statsQuery.data?.activeLinkCount ?? "—"} />
        <StatCard label="Total clicks" value={statsQuery.data?.totalClicks ?? "—"} />
      </div>

      <div className="mb-3">
        <Alert>{error}</Alert>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-900">Users</h2>
      {usersQuery.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Links</th>
                <th className="py-3">Joined</th>
                <th className="py-3">Status</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.data?.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-800">
                    {user.name} {user.isAdmin && <span className="text-xs text-brand-600">(admin)</span>}
                  </td>
                  <td className="py-2.5 text-slate-600">{user.email}</td>
                  <td className="py-2.5 text-slate-600">{user.linkCount}</td>
                  <td className="py-2.5 text-slate-500">{formatDate(user.createdAt)}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-2.5 text-right pr-4">
                    <Button variant="secondary" onClick={() => onToggleUser(user)} disabled={user.isAdmin}>
                      {user.isActive ? "Disable" : "Enable"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
