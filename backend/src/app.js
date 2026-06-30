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
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
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
