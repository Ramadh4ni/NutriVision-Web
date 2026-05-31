const { findProfileByUserId } = require("../repositories/profile.repository");
const { findLatestScanByUserId } = require("../repositories/scan.repository");
const {
  buildRecipeRecommendations,
  saveGeneratedRecipes,
  listRecipeHistory,
  setRecipeFavorite,
  setRecipeCooked,
} = require("../services/recipe.service");

async function recommendRecipes(req, res, next) {
  try {
    const profile = await findProfileByUserId(req.user.id);
    const latestScan = await findLatestScanByUserId(req.user.id);
    const scanSummary = latestScan ? latestScan.detectedItems.join(", ") : "user nutrition preferences";
    const goal = (req.body.goal || profile?.goal || "maintenance").toString().toLowerCase();
    const generatedRecipes = buildRecipeRecommendations({
      userId: req.user.id,
      goal,
      scanSummary,
    });

    const savedRecipes = await saveGeneratedRecipes(generatedRecipes);

    res.status(201).json({
      success: true,
      message: "Recipe recommendations generated successfully.",
      data: savedRecipes,
    });
  } catch (error) {
    next(error);
  }
}

async function getRecipeHistory(req, res, next) {
  try {
    const recipes = await listRecipeHistory(req.user.id);

    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
}

async function toggleFavorite(req, res, next) {
  try {
    const recipe = await setRecipeFavorite(req.user.id, req.params.id, true);

    res.status(200).json({
      success: true,
      message: "Recipe saved to favorites.",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const recipe = await setRecipeFavorite(req.user.id, req.params.id, false);

    res.status(200).json({
      success: true,
      message: "Recipe removed from favorites.",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
}

async function markAsCooked(req, res, next) {
  try {
    const recipe = await setRecipeCooked(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Recipe marked as cooked.",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  recommendRecipes,
  getRecipeHistory,
  toggleFavorite,
  removeFavorite,
  markAsCooked,
};
