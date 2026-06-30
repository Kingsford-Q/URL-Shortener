import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../lib/format";
import Badge from "./Badge";
import { Copy, EyeOff, Lock, Pencil, Power, Trash, Zap } from "./icons";

function statusInfo(link) {
  const now = new Date();
  if (!link.isActive) return { label: "Disabled", tone: "ink" };
  if (link.expiresAt && new Date(link.expiresAt) < now) return { label: "Expired", tone: "amber" };
  if (link.oneTimeUse && link.used) return { label: "Used", tone: "amber" };
  return { label: "Active", tone: "brand" };
}

function IconButton({ title, onClick, children, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        danger ? "text-ink-400 hover:bg-red-50 hover:text-red-600" : "text-ink-400 hover:bg-ink-100 hover:text-ink-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function LinkRow({ link, shortUrl, onEdit, onDelete, onToggle }) {
  const [copied, setCopied] = useState(false);
  const status = statusInfo(link);

  const copy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <tr className="border-b border-ink-100 transition-colors last:border-0 hover:bg-ink-50/60">
      <td className="py-4 pl-5 pr-4">
        <div className="flex flex-wrap items-center gap-2">
          <RouterLink
            to={`/links/${link.id}`}
            className="font-mono text-[13px] font-medium text-ink-900 hover:text-brand-700 hover:underline"
          >
            {link.shortCode}
          </RouterLink>
          <Badge tone={status.tone}>{status.label}</Badge>
          {link.hasPassword && <Lock size={12} className="text-ink-400" />}
          {link.isPrivate && <EyeOff size={12} className="text-ink-400" />}
          {link.oneTimeUse && <Zap size={12} className="text-ink-400" />}
        </div>
        <div className="mt-0.5 max-w-xs truncate text-xs text-ink-400" title={link.originalUrl}>
          {link.originalUrl}
        </div>
      </td>
      <td className="py-4 pr-4 font-mono text-sm tabular-nums text-ink-600">{link.clickCount}</td>
      <td className="py-4 pr-4 text-sm text-ink-400">{formatDate(link.createdAt)}</td>
      <td className="py-4 pr-4 text-sm text-ink-400">{link.expiresAt ? formatDate(link.expiresAt) : "Never"}</td>
      <td className="py-4 pr-3 text-right">
        <div className="flex justify-end gap-0.5">
          <IconButton title={copied ? "Copied" : "Copy short URL"} onClick={copy}>
            <Copy size={14} />
          </IconButton>
          <IconButton title={link.isActive ? "Disable" : "Enable"} onClick={() => onToggle(link)}>
            <Power size={14} />
          </IconButton>
          <IconButton title="Edit" onClick={() => onEdit(link)}>
            <Pencil size={14} />
          </IconButton>
          <IconButton title="Delete" danger onClick={() => onDelete(link)}>
            <Trash size={14} />
          </IconButton>
        </div>
      </td>
    </tr>
  );
}
