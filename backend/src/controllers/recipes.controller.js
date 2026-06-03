const { findProfileByUserId } = require("../repositories/profile.repository");
const {
  findLatestScanByUserId,
  findRecentScansByUserId,
} = require("../repositories/scan.repository");
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
    const recentScans = await findRecentScansByUserId(req.user.id, 5);

    // Fallback to the latest single scan if no scans in the last 5 minutes
    let scansToProcess = recentScans;
    if (recentScans.length === 0) {
      const latest = await findLatestScanByUserId(req.user.id);
      scansToProcess = latest ? [latest] : [];
    }

    const allDetectedItems = [
      ...new Set(scansToProcess.flatMap((scan) => scan.detectedItems || [])),
    ];
    const scanSummary = allDetectedItems.join(", ") || "user nutrition preferences";
    const latestScanId = scansToProcess[0]?.id || null;

    const goal = (req.body.goal || profile?.goal || "maintenance")
      .toString()
      .toLowerCase();

    const recipeCount = allDetectedItems.length >= 2 ? 8 : 4;

    const generatedRecipes = buildRecipeRecommendations({
      userId: req.user.id,
      goal,
      detectedItems: allDetectedItems,
      scanSummary,
      profile,
      scanId: latestScanId,
      recipeCount,
    });

    const savedRecipes = await saveGeneratedRecipes(await generatedRecipes);

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
