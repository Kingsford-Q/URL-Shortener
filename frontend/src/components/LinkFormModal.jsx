import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import Toggle from "./Toggle";
import { Lock, EyeOff, Globe, Zap, Hourglass } from "./icons";
import { apiErrorMessage } from "../api/client";
import { isValidUrl, normalizeUrl, toIsoOrUndefined, toLocalInputValue } from "../lib/format";

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

    const url = normalizeUrl(originalUrl);
    setOriginalUrl(url);
    if (!isValidUrl(url)) {
      setError("Enter a valid URL, for example example.com/page or https://example.com/page.");
      return;
    }

    setLoading(true);
    try {
      const payload = { originalUrl: url };

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
          icon={Globe}
          type="text"
          inputMode="url"
          autoComplete="url"
          required
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          onBlur={(e) => setOriginalUrl(normalizeUrl(e.target.value))}
          placeholder="example.com/page"
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

        <div className="divide-y divide-ink-100 rounded-xl border border-ink-100">
          <div className="p-4">
            <Toggle
              checked={hasPassword}
              onChange={setHasPassword}
              icon={<Lock size={14} />}
              label="Password protect"
              description="Visitors must enter a password before continuing"
            />
            {hasPassword && (
              <Input
                type="password"
                className="mt-3"
                placeholder={isEdit && link.hasPassword ? "Leave blank to keep current password" : "Set a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={4}
              />
            )}
          </div>

          <div className="p-4">
            <Toggle
              checked={hasExpiry}
              onChange={setHasExpiry}
              icon={<Hourglass size={14} />}
              label="Expires at a set time"
              description="Link stops working automatically after this date"
            />
            {hasExpiry && (
              <Input
                type="datetime-local"
                className="mt-3"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            )}
          </div>

          <div className="p-4">
            <Toggle
              checked={oneTimeUse}
              onChange={setOneTimeUse}
              icon={<Zap size={14} />}
              label="One-time use"
              description="Link stops working after the first click"
            />
          </div>

          <div className="p-4">
            <Toggle
              checked={isPrivate}
              onChange={setIsPrivate}
              icon={<EyeOff size={14} />}
              label="Private"
              description="Only visible to you in your dashboard"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
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
