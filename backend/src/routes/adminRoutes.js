const express = require("express");
const ctrl = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get("/users", ctrl.listUsers);
router.patch("/users/:id/disable", ctrl.disableUser);
router.delete("/links/:id", ctrl.deleteLink);
router.get("/stats", ctrl.stats);

module.exports = router;
