const express = require("express");
const ctrl = require("../controllers/analyticsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/:id", requireAuth, ctrl.getAnalytics);

module.exports = router;
