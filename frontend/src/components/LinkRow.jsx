import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../lib/format";

function StatusBadge({ link }) {
  const now = new Date();
  let label = "Active";
  let cls = "bg-emerald-100 text-emerald-700";

  if (!link.isActive) {
    label = "Disabled";
    cls = "bg-slate-200 text-slate-600";
  } else if (link.expiresAt && new Date(link.expiresAt) < now) {
    label = "Expired";
    cls = "bg-amber-100 text-amber-700";
  } else if (link.oneTimeUse && link.used) {
    label = "Used";
    cls = "bg-amber-100 text-amber-700";
  }

  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

export default function LinkRow({ link, shortUrl, onEdit, onDelete, onToggle }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-3 pr-4">
        <div className="flex flex-wrap items-center gap-2">
          <RouterLink to={`/links/${link.id}`} className="font-medium text-brand-700 hover:underline">
            {link.shortCode}
          </RouterLink>
          <StatusBadge link={link} />
          {link.hasPassword && <span title="Password protected">🔒</span>}
          {link.isPrivate && <span title="Private">🙈</span>}
          {link.oneTimeUse && <span title="One-time use">1️⃣</span>}
        </div>
        <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500" title={link.originalUrl}>
          {link.originalUrl}
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-slate-600">{link.clickCount}</td>
      <td className="py-3 pr-4 text-sm text-slate-500">{formatDate(link.createdAt)}</td>
      <td className="py-3 pr-4 text-sm text-slate-500">{link.expiresAt ? formatDate(link.expiresAt) : "Never"}</td>
      <td className="py-3 text-right text-sm">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
            title="Copy short URL"
          >
            Copy
          </button>
          <button onClick={() => onToggle(link)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">
            {link.isActive ? "Disable" : "Enable"}
          </button>
          <button onClick={() => onEdit(link)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">
            Edit
          </button>
          <button onClick={() => onDelete(link)} className="rounded px-2 py-1 text-red-500 hover:bg-red-50">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
