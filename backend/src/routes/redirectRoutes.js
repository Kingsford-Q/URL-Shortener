const express = require("express");
const ctrl = require("../controllers/redirectController");
const validate = require("../middleware/validate");
const { redirectLimiter } = require("../middleware/rateLimiter");

// Mounted at /api/redirect for the password-verification API call.
const apiRouter = express.Router();
apiRouter.post("/:shortCode/verify", redirectLimiter, validate(ctrl.verifySchema), ctrl.verify);

// Mounted at the app root for the actual GET /:shortCode redirect.
const rootRouter = express.Router();
rootRouter.get("/:shortCode", redirectLimiter, ctrl.resolve);

module.exports = { apiRouter, rootRouter };
