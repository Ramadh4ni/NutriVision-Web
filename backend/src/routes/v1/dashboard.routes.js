const express = require("express");

const { getDashboard } = require("../../controllers/dashboard.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, getDashboard);

module.exports = router;
