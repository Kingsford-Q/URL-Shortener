const ApiError = require("../utils/ApiError");

function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found" });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Validation failed", details: err.flatten() });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "A record with that value already exists" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = { notFoundHandler, errorHandler };
