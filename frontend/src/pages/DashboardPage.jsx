import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as linksApi from "../api/links";
import { apiErrorMessage } from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import LinkRow from "../components/LinkRow";
import LinkFormModal from "../components/LinkFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { SkeletonRow } from "../components/Skeleton";
import { Inbox, Plus, Search } from "../components/icons";

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deletingLink, setDeletingLink] = useState(null);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

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
    onSuccess: () => {
      invalidate();
      setDeletingLink(null);
      setDeleteError("");
    },
    onError: (err) => setDeleteError(apiErrorMessage(err)),
  });
  const toggleMutation = useMutation({
    mutationFn: linksApi.toggleLink,
    onSuccess: invalidate,
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const onDelete = (link) => {
    setDeleteError("");
    setDeletingLink(link);
  };

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltering = Boolean(search) || status !== "all";

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-950">Your links</h1>
          <p className="mt-1 text-sm text-ink-500">
            {total > 0 ? `${total} link${total === 1 ? "" : "s"} total` : "Manage every short link in one place"}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={15} />
          New link
        </Button>
      </div>

      <div className="mb-4">
        <Alert>{error}</Alert>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="w-64">
          <Input
            icon={Search}
            placeholder="Search alias or URL"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
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
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="clicks">Most clicks</option>
        </Select>
        {isFetching && !isLoading && <Spinner className="h-4 w-4" />}
      </div>

      {isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : data?.items?.length ? (
        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-soft">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3">Link</th>
                <th className="py-3">Clicks</th>
                <th className="py-3">Created</th>
                <th className="py-3">Expires</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
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
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <Inbox size={20} />
          </span>
          <h3 className="mt-4 text-sm font-semibold text-ink-800">
            {isFiltering ? "No links match your filters" : "No links yet"}
          </h3>
          <p className="mt-1 max-w-xs text-sm text-ink-500">
            {isFiltering
              ? "Try a different search term or clear the status filter."
              : "Create your first short link to start tracking clicks."}
          </p>
          {!isFiltering && (
            <Button className="mt-5" onClick={() => setShowCreate(true)}>
              <Plus size={15} />
              New link
            </Button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm tabular-nums text-ink-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
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
      {deletingLink && (
        <ConfirmDialog
          title="Delete this link?"
          body={`"${deletingLink.shortCode}" will be permanently deleted, along with its click history. This cannot be undone.`}
          confirmLabel="Delete link"
          danger
          loading={deleteMutation.isPending}
          error={deleteError}
          onConfirm={() => deleteMutation.mutate(deletingLink.id)}
          onClose={() => setDeletingLink(null)}
        />
      )}
    </div>
  );
}
