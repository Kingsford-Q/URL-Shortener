const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { apiRouter: redirectApiRouter, rootRouter: redirectRootRouter } = require("./routes/redirectRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

// CORS_ORIGINS is a comma-separated allow-list, distinct from FRONTEND_URL
// (which is the single canonical URL used for redirects). This lets one
// backend serve both localhost (desktop dev) and a LAN IP (e.g. testing on
// a phone) at once. The deployed frontend's URL is baked in as part of the
// default so CORS works even if the env var isn't set on the host -- the
// env var still wins whenever it's actually present.
const DEFAULT_ORIGINS = "http://localhost:5173,https://url-shortener-dun-iota.vercel.app";
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || DEFAULT_ORIGINS)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/redirect", redirectApiRouter);

// Root-level short link redirect, e.g. GET /abc1234. Must be registered
// after all /api routes so it only catches genuine short codes.
app.use("/", redirectRootRouter);

app.use("/api", notFoundHandler);
app.use(errorHandler);

module.exports = app;
