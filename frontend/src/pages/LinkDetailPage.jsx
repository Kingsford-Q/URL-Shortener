import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as linksApi from "../api/links";
import { fetchAnalytics } from "../api/analytics";
import { formatDate, formatDateShort } from "../lib/format";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import Select from "../components/Select";
import Alert from "../components/Alert";
import Skeleton from "../components/Skeleton";
import { ChevronLeft, Copy, Globe, Inbox, QrCode as QrIcon, TrendUp, User } from "../components/icons";

const COLORS = ["#2f9670", "#52b487", "#85d1ac", "#b6e6cd", "#1c5f49", "#194c3b"];

function StatCard({ label, value, icon: StatIcon }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 text-ink-400">
        {StatIcon && <StatIcon size={13} />}
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      {value === undefined ? (
        <Skeleton className="mt-2.5 h-6 w-16" />
      ) : (
        <div className="mt-2 font-mono text-xl font-semibold tabular-nums text-ink-950">{value}</div>
      )}
    </div>
  );
}

function BreakdownChart({ title, data }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <h3 className="mb-1 text-sm font-semibold text-ink-800">{title}</h3>
      {data?.length ? (
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="name" outerRadius={64} label={(d) => d.name}>
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eeece6", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="py-12 text-center text-sm text-ink-300">No data yet</p>
      )}
    </div>
  );
}

export default function LinkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [days, setDays] = useState(30);
  const [qrFormat, setQrFormat] = useState("png");
  const [qrUrl, setQrUrl] = useState(null);
  const [qrError, setQrError] = useState("");

  const linkQuery = useQuery({
    queryKey: ["link", id],
    queryFn: () => linksApi.getLink(id),
  });

  const analyticsQuery = useQuery({
    queryKey: ["analytics", id, days],
    queryFn: () => fetchAnalytics(id, days),
    enabled: Boolean(linkQuery.data),
  });

  useEffect(() => {
    let objectUrl;
    setQrUrl(null);
    setQrError("");
    linksApi
      .fetchQrBlob(id, qrFormat)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setQrUrl(objectUrl);
      })
      .catch(() => setQrError("Could not load QR code"));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, qrFormat]);

  if (linkQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (linkQuery.isError) {
    return <Alert>Could not load this link. It may not exist or you don't have access to it.</Alert>;
  }

  const { link, shortUrl } = linkQuery.data;
  const analytics = analyticsQuery.data;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-1 text-sm text-ink-500 transition-colors hover:text-ink-800"
      >
        <ChevronLeft size={14} />
        Back
      </button>

      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-ink-950">{link.shortCode}</h1>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm text-brand-700 hover:underline"
          >
            {shortUrl}
          </a>
          <p className="mt-1.5 max-w-xl truncate text-sm text-ink-500" title={link.originalUrl}>
            → {link.originalUrl}
          </p>
        </div>
        <RouterLink to="/dashboard">
          <Button variant="secondary">Manage links</Button>
        </RouterLink>
      </div>

      <div className="grid gap-7 lg:grid-cols-3">
        <div className="space-y-7 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total clicks" value={analytics?.totalClicks} icon={TrendUp} />
            <StatCard label="Unique visitors" value={analytics?.uniqueVisitors} icon={User} />
            <StatCard label="Created" value={formatDate(link.createdAt)} />
            <StatCard label="Expires" value={link.expiresAt ? formatDate(link.expiresAt) : "Never"} />
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-800">Clicks over time</h3>
              <Select value={days} onChange={(e) => setDays(Number(e.target.value))} className="py-1.5 text-xs">
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </Select>
            </div>
            {analyticsQuery.isLoading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeece6" />
                  <XAxis dataKey="date" tickFormatter={formatDateShort} fontSize={12} stroke="#9c9480" />
                  <YAxis allowDecimals={false} fontSize={12} stroke="#9c9480" />
                  <Tooltip
                    labelFormatter={formatDateShort}
                    contentStyle={{ borderRadius: 10, border: "1px solid #eeece6", fontSize: 12 }}
                  />
                  <Bar dataKey="count" fill="#2f9670" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <BreakdownChart title="Browsers" data={analytics?.browsers} />
            <BreakdownChart title="Operating systems" data={analytics?.operatingSystems} />
            <BreakdownChart title="Devices" data={analytics?.devices} />
            <BreakdownChart title="Referrers" data={analytics?.referrers} />
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
            <h3 className="mb-3 text-sm font-semibold text-ink-800">Recent visits</h3>
            {analytics?.recent?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wide text-ink-400">
                    <tr>
                      <th className="py-1.5 pr-4">Time</th>
                      <th className="py-1.5 pr-4">Browser</th>
                      <th className="py-1.5 pr-4">OS</th>
                      <th className="py-1.5 pr-4">Device</th>
                      <th className="py-1.5">Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recent.map((v) => (
                      <tr key={v.id} className="border-t border-ink-100">
                        <td className="py-2 pr-4 text-ink-400">{formatDate(v.visitedAt)}</td>
                        <td className="py-2 pr-4 text-ink-700">{v.browser}</td>
                        <td className="py-2 pr-4 text-ink-700">{v.os}</td>
                        <td className="py-2 pr-4 text-ink-700">{v.device}</td>
                        <td className="py-2 text-ink-500">{v.referrer || "Direct"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-400">
                  <Inbox size={16} />
                </span>
                <p className="mt-3 text-sm text-ink-400">No visits yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 text-center shadow-soft">
            <h3 className="mb-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-800">
              <QrIcon size={14} />
              QR code
            </h3>
            <Alert>{qrError}</Alert>
            {qrUrl ? (
              <div className="mx-auto w-fit rounded-2xl border border-ink-100 bg-ink-50 p-4">
                <img src={qrUrl} alt={`QR code for ${shortUrl}`} className="h-44 w-44" />
              </div>
            ) : (
              <Skeleton className="mx-auto h-44 w-44 rounded-2xl" />
            )}
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant={qrFormat === "png" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setQrFormat("png")}
              >
                PNG
              </Button>
              <Button
                variant={qrFormat === "svg" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setQrFormat("svg")}
              >
                SVG
              </Button>
            </div>
            {qrUrl && (
              <a
                href={qrUrl}
                download={`${link.shortCode}.${qrFormat}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
              >
                <Copy size={13} />
                Download {qrFormat.toUpperCase()}
              </a>
            )}
          </div>

          {analytics?.countries?.length > 0 && (
            <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-800">
                <Globe size={13} />
                Countries
              </h3>
              <ul className="space-y-1.5 text-sm">
                {analytics.countries.slice(0, 6).map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-ink-600">
                    <span>{c.name}</span>
                    <span className="font-mono tabular-nums text-ink-400">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
