const express = require("express");
const ctrl = require("../controllers/authController");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authLimiter, validate(ctrl.registerSchema), ctrl.register);
router.post("/login", authLimiter, validate(ctrl.loginSchema), ctrl.login);
router.get("/me", requireAuth, ctrl.me);

module.exports = router;
