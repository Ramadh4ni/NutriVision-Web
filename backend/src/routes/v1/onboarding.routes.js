const express = require("express");

const { upsertOnboarding } = require("../../controllers/onboarding.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { validateBody } = require("../../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validateBody(["age", "gender", "weightKg", "heightCm", "goal", "activityLevel"]),
  upsertOnboarding
);

module.exports = router;
