import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as linksApi from "../api/links";
import { apiErrorMessage } from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import LinkRow from "../components/LinkRow";
import LinkFormModal from "../components/LinkFormModal";

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [error, setError] = useState("");

  const queryKey = ["links", { search, status, sort, page }];
  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      linksApi.listLinks({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        sort,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["links"] });

  const createMutation = useMutation({
    mutationFn: linksApi.createLink,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => linksApi.updateLink(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: linksApi.deleteLink,
    onSuccess: invalidate,
    onError: (err) => setError(apiErrorMessage(err)),
  });
  const toggleMutation = useMutation({
    mutationFn: linksApi.toggleLink,
    onSuccess: invalidate,
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const onDelete = (link) => {
    if (!confirm(`Delete short link "${link.shortCode}"? This cannot be undone.`)) return;
    setError("");
    deleteMutation.mutate(link.id);
  };

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Your links</h1>
        <Button onClick={() => setShowCreate(true)}>+ New link</Button>
      </div>

      <div className="mb-4">
        <Alert>{error}</Alert>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="w-64">
          <Input
            placeholder="Search alias or URL..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="disabled">Disabled</option>
        </select>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="clicks">Most clicks</option>
        </select>
        {isFetching && !isLoading && <Spinner />}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : data?.items?.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Link</th>
                <th className="py-3">Clicks</th>
                <th className="py-3">Created</th>
                <th className="py-3">Expires</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="px-4">
              {data.items.map((link) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  shortUrl={linksApi.buildShortUrl(link.shortCode)}
                  onEdit={setEditingLink}
                  onDelete={onDelete}
                  onToggle={(l) => {
                    setError("");
                    toggleMutation.mutate(l.id);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          No links yet. Create your first short link to get started.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {showCreate && (
        <LinkFormModal
          onClose={() => setShowCreate(false)}
          onSubmit={(payload) => createMutation.mutateAsync(payload)}
        />
      )}
      {editingLink && (
        <LinkFormModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSubmit={(payload) => updateMutation.mutateAsync({ id: editingLink.id, payload })}
        />
      )}
    </div>
  );
}
