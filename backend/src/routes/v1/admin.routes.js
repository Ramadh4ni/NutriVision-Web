const express = require("express");

const { getAdminOverview } = require("../../controllers/admin.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/role.middleware");

const router = express.Router();

router.get("/overview", requireAuth, requireRole("admin"), getAdminOverview);

module.exports = router;
