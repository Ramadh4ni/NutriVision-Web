const express = require("express");

const { scanFood } = require("../../controllers/scan.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { upload } = require("../../middlewares/upload.middleware");

const router = express.Router();

router.post("/", requireAuth, upload.single("image"), scanFood);

module.exports = router;
