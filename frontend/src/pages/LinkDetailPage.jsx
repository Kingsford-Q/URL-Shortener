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
import Alert from "../components/Alert";

const COLORS = ["#3a63f5", "#5c87ff", "#8bb0ff", "#b9d1ff", "#dce8ff", "#2a47d6"];

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function BreakdownChart({ title, data }) {
  if (!data?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">{title}</h3>
        <p className="text-sm text-slate-400">No data yet</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="name" outerRadius={70} label={(d) => d.name}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
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
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-500 hover:underline">
        ← Back
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{link.shortCode}</h1>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
            {shortUrl}
          </a>
          <p className="mt-1 max-w-xl truncate text-sm text-slate-500" title={link.originalUrl}>
            → {link.originalUrl}
          </p>
        </div>
        <RouterLink to="/dashboard">
          <Button variant="secondary">Manage links</Button>
        </RouterLink>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total clicks" value={analytics?.totalClicks ?? "—"} />
            <StatCard label="Unique visitors" value={analytics?.uniqueVisitors ?? "—"} />
            <StatCard label="Created" value={formatDate(link.createdAt)} />
            <StatCard label="Expires" value={link.expiresAt ? formatDate(link.expiresAt) : "Never"} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Clicks over time</h3>
              <select
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            {analyticsQuery.isLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDateShort} fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip labelFormatter={formatDateShort} />
                  <Bar dataKey="count" fill="#3a63f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <BreakdownChart title="Browsers" data={analytics?.browsers} />
            <BreakdownChart title="Operating systems" data={analytics?.operatingSystems} />
            <BreakdownChart title="Devices" data={analytics?.devices} />
            <BreakdownChart title="Referrers" data={analytics?.referrers} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Recent visits</h3>
            {analytics?.recent?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-400">
                    <tr>
                      <th className="py-1 pr-4">Time</th>
                      <th className="py-1 pr-4">Browser</th>
                      <th className="py-1 pr-4">OS</th>
                      <th className="py-1 pr-4">Device</th>
                      <th className="py-1">Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recent.map((v) => (
                      <tr key={v.id} className="border-t border-slate-100">
                        <td className="py-1.5 pr-4 text-slate-500">{formatDate(v.visitedAt)}</td>
                        <td className="py-1.5 pr-4">{v.browser}</td>
                        <td className="py-1.5 pr-4">{v.os}</td>
                        <td className="py-1.5 pr-4">{v.device}</td>
                        <td className="py-1.5 text-slate-500">{v.referrer || "Direct"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No visits yet</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">QR code</h3>
            <Alert>{qrError}</Alert>
            {qrUrl ? (
              <img src={qrUrl} alt="QR code" className="mx-auto h-48 w-48" />
            ) : (
              <div className="flex h-48 items-center justify-center">
                <Spinner />
              </div>
            )}
            <div className="mt-3 flex justify-center gap-2">
              <Button
                variant={qrFormat === "png" ? "primary" : "secondary"}
                onClick={() => setQrFormat("png")}
              >
                PNG
              </Button>
              <Button
                variant={qrFormat === "svg" ? "primary" : "secondary"}
                onClick={() => setQrFormat("svg")}
              >
                SVG
              </Button>
            </div>
            {qrUrl && (
              <a
                href={qrUrl}
                download={`${link.shortCode}.${qrFormat}`}
                className="mt-3 block text-sm font-medium text-brand-600 hover:underline"
              >
                Download {qrFormat.toUpperCase()}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
