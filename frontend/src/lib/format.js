export function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDateShort(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// <input type="datetime-local"> gives "YYYY-MM-DDTHH:mm" with no timezone;
// the API requires a full ISO-8601 datetime string (zod's .datetime()).
export function toIsoOrUndefined(localDateTimeValue) {
  if (!localDateTimeValue) return undefined;
  return new Date(localDateTimeValue).toISOString();
}

export function toLocalInputValue(isoValue) {
  if (!isoValue) return "";
  const d = new Date(isoValue);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const URL_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

// People type "linkedin.com/in/me" far more often than "https://linkedin.com/in/me".
// Treat a missing scheme as an omission, not an error, and fill in https://.
export function normalizeUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed || URL_SCHEME.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
