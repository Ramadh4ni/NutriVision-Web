const express = require("express");

const {
  register,
  login,
  googleAuth,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPasswordAction,
  getCurrentUser,
  logout,
} = require("../../controllers/auth.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { validateBody } = require("../../middlewares/validate.middleware");
const { authLimiter } = require("../../middlewares/rate-limit.middleware");

const router = express.Router();

router.post("/register", authLimiter, validateBody(["email", "password"]), register);
router.post("/login", authLimiter, validateBody(["email", "password"]), login);
router.post("/google", authLimiter, validateBody(["email"]), googleAuth);
router.post("/refresh", validateBody(["refreshToken"]), refreshToken);
router.post("/verify-email", validateBody(["token"]), verifyEmail);
router.post("/forgot-password", authLimiter, validateBody(["email"]), forgotPassword);
router.post("/reset-password", authLimiter, validateBody(["token", "newPassword"]), resetPasswordAction);
router.post("/logout", logout);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
