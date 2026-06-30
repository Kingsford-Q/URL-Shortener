import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { apiErrorMessage } from "../api/client";
import { toIsoOrUndefined, toLocalInputValue } from "../lib/format";

const ALIAS_HINT = "3-32 letters, numbers, _ or -";

export default function LinkFormModal({ link, onClose, onSubmit }) {
  const isEdit = Boolean(link);

  const [originalUrl, setOriginalUrl] = useState(link?.originalUrl || "");
  const [customAlias, setCustomAlias] = useState("");
  const [hasPassword, setHasPassword] = useState(Boolean(link?.hasPassword));
  const [password, setPassword] = useState("");
  const [hasExpiry, setHasExpiry] = useState(Boolean(link?.expiresAt));
  const [expiresAt, setExpiresAt] = useState(toLocalInputValue(link?.expiresAt));
  const [isPrivate, setIsPrivate] = useState(Boolean(link?.isPrivate));
  const [oneTimeUse, setOneTimeUse] = useState(Boolean(link?.oneTimeUse));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { originalUrl };

      if (!isEdit && customAlias.trim()) payload.customAlias = customAlias.trim();

      if (hasExpiry) {
        if (expiresAt) payload.expiresAt = toIsoOrUndefined(expiresAt);
      } else if (isEdit) {
        payload.expiresAt = null;
      }

      if (hasPassword) {
        if (password) payload.password = password;
        else if (!isEdit) throw new Error("Enter a password or disable password protection");
      } else if (isEdit && link.hasPassword) {
        payload.password = null;
      }

      payload.isPrivate = isPrivate;
      payload.oneTimeUse = oneTimeUse;

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message && !err.response ? err.message : apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit link" : "Create link"} onClose={onClose} width="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>

        <Input
          label="Destination URL"
          type="url"
          required
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/page"
        />

        {!isEdit && (
          <Input
            label="Custom alias (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="my-link"
            pattern="[a-zA-Z0-9_-]{3,32}"
            title={ALIAS_HINT}
          />
        )}

        <div className="space-y-2 rounded-lg border border-slate-200 p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={hasPassword} onChange={(e) => setHasPassword(e.target.checked)} />
            Password protect this link
          </label>
          {hasPassword && (
            <Input
              type="password"
              placeholder={isEdit && link.hasPassword ? "Leave blank to keep current password" : "Set a password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={4}
            />
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-slate-200 p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={hasExpiry} onChange={(e) => setHasExpiry(e.target.checked)} />
            Expires at a specific date/time
          </label>
          {hasExpiry && (
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={oneTimeUse} onChange={(e) => setOneTimeUse(e.target.checked)} />
          One-time use (link stops working after first click)
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          Private (visible only to you)
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Save changes" : "Create link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
