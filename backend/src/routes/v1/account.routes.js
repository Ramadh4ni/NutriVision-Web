const express = require("express");

const { updatePassword, updateProfile } = require("../../controllers/account.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { validateBody } = require("../../middlewares/validate.middleware");

const router = express.Router();

router.patch("/password", requireAuth, validateBody(["currentPassword", "newPassword"]), updatePassword);
router.patch("/profile", requireAuth, updateProfile);

module.exports = router;
