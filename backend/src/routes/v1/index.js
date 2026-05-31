const express = require("express");

const authRoutes = require("./auth.routes");
const onboardingRoutes = require("./onboarding.routes");
const dashboardRoutes = require("./dashboard.routes");
const scanRoutes = require("./scan.routes");
const recipesRoutes = require("./recipes.routes");
const accountRoutes = require("./account.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/scan-food", scanRoutes);
router.use("/recipes", recipesRoutes);
router.use("/account", accountRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
