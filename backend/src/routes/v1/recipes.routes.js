const express = require("express");

const {
  recommendRecipes,
  getRecipeHistory,
  toggleFavorite,
  removeFavorite,
  markAsCooked,
} = require("../../controllers/recipes.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/recommend", requireAuth, recommendRecipes);
router.get("/history", requireAuth, getRecipeHistory);
router.post("/:id/favorite", requireAuth, toggleFavorite);
router.delete("/:id/favorite", requireAuth, removeFavorite);
router.patch("/:id/cooked", requireAuth, markAsCooked);

module.exports = router;
