import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "../api/admin";
import { apiErrorMessage } from "../api/client";
import { formatDate } from "../lib/format";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Skeleton, { SkeletonRow } from "../components/Skeleton";
import { BarChart, Inbox, Link2, Shield, User } from "../components/icons";

function StatCard({ label, value, icon: StatIcon }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 text-ink-400">
        <StatIcon size={13} />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      {value === undefined ? (
        <Skeleton className="mt-2.5 h-6 w-12" />
      ) : (
        <div className="mt-2 font-mono text-xl font-semibold tabular-nums text-ink-950">{value}</div>
      )}
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
      <div className="mb-7">
        <h1 className="font-display text-2xl font-semibold text-ink-950">Admin</h1>
        <p className="mt-1 text-sm text-ink-500">Platform-wide stats and user management</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Users" value={statsQuery.data?.userCount} icon={User} />
        <StatCard label="Links" value={statsQuery.data?.linkCount} icon={Link2} />
        <StatCard label="Active links" value={statsQuery.data?.activeLinkCount} icon={Shield} />
        <StatCard label="Total clicks" value={statsQuery.data?.totalClicks} icon={BarChart} />
      </div>

      <div className="mb-3">
        <Alert>{error}</Alert>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Users</h2>
      {usersQuery.isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : usersQuery.data?.length ? (
        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-ink-400">
              <tr className="border-b border-ink-100">
                <th className="px-5 py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Links</th>
                <th className="py-3">Joined</th>
                <th className="py-3">Status</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.data.map((user) => (
                <tr key={user.id} className="border-t border-ink-100 transition-colors hover:bg-ink-50/60">
                  <td className="px-5 py-3 font-medium text-ink-800">
                    {user.name}{" "}
                    {user.isAdmin && (
                      <Badge tone="brand" className="ml-1">
                        Admin
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 text-ink-500">{user.email}</td>
                  <td className="py-3 font-mono tabular-nums text-ink-500">{user.linkCount}</td>
                  <td className="py-3 text-ink-400">{formatDate(user.createdAt)}</td>
                  <td className="py-3">
                    <Badge tone={user.isActive ? "brand" : "ink"}>{user.isActive ? "Active" : "Disabled"}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => onToggleUser(user)} disabled={user.isAdmin}>
                      {user.isActive ? "Disable" : "Enable"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <Inbox size={20} />
          </span>
          <p className="mt-3 text-sm text-ink-500">No users yet</p>
        </div>
      )}
    </div>
  );
}
