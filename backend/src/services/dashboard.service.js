const { findProfileByUserId } = require("../repositories/profile.repository");
const { findRecipesByUserId } = require("../repositories/recipe.repository");
const { findLatestScanByUserId } = require("../repositories/scan.repository");
const { calculateDailyCalories } = require("./profile.service");

async function getDashboardSummary(userId) {
  const [profile, recipes, latestScan] = await Promise.all([
    findProfileByUserId(userId),
    findRecipesByUserId(userId),
    findLatestScanByUserId(userId),
  ]);

  const recentRecipes = recipes.slice(0, 5);
  const favoriteRecipes = recipes.filter((item) =>
    item.source?.includes("favorite:true"),
  );
  const cookedRecipes = recipes.filter((item) =>
    item.source?.includes("cooked:true"),
  );

  return {
    profile,
    latestScan,
    nutritionTarget: {
      estimatedDailyCalories: calculateDailyCalories(profile),
    },
    stats: {
      totalRecipesGenerated: recipes.length,
      totalFavorites: favoriteRecipes.length,
      totalCooked: cookedRecipes.length,
    },
    recentRecipes,
  };
}

module.exports = {
  getDashboardSummary,
};
