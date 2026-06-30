export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDateShort(value) {
  if (!value) return "—";
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
