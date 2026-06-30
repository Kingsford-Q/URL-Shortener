const express = require("express");
const ctrl = require("../controllers/linkController");
const validate = require("../middleware/validate");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { createLinkLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/", createLinkLimiter, optionalAuth, validate(ctrl.createLinkSchema), ctrl.create);
router.get("/", requireAuth, ctrl.list);
router.get("/:id", requireAuth, validate(ctrl.idParamSchema), ctrl.getOne);
router.put("/:id", requireAuth, validate(ctrl.updateLinkSchema), ctrl.update);
router.delete("/:id", requireAuth, validate(ctrl.idParamSchema), ctrl.remove);
router.patch("/:id/toggle", requireAuth, validate(ctrl.idParamSchema), ctrl.toggle);
router.get("/:id/qr", requireAuth, validate(ctrl.idParamSchema), ctrl.qr);

module.exports = router;
