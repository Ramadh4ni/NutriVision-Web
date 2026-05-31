const { v4: uuidv4 } = require("uuid");

const { createManyRecipes, findRecipesByUserId, findRecipeByIdForUser, updateRecipe } = require("../repositories/recipe.repository");

function buildRecipeRecommendations({ userId, goal, scanSummary }) {
  const templates = [
    {
      title: "Chicken Veggie Power Bowl",
      description: "Balanced meal for sustainable energy and satiety.",
      ingredients: ["chicken breast", "brown rice", "spinach", "carrot"],
      instructions: [
        "Cook the brown rice.",
        "Pan-sear the chicken with light seasoning.",
        "Saute spinach and carrot, then assemble the bowl.",
      ],
      tags: ["balanced", "high-protein"],
      nutrition: { calories: 510, protein: 39, carbs: 46, fat: 15 },
    },
    {
      title: "Tofu Stir-Fry Plate",
      description: "Simple plant-based option with solid protein intake.",
      ingredients: ["tofu", "mixed vegetables", "garlic", "rice"],
      instructions: [
        "Press and cube tofu.",
        "Stir-fry garlic, tofu, and vegetables.",
        "Serve with warm rice.",
      ],
      tags: ["plant-based", "quick"],
      nutrition: { calories: 460, protein: 24, carbs: 50, fat: 18 },
    },
  ];

  return templates.map((template) => ({
    id: uuidv4(),
    userId,
    title: goal === "bulking" ? `${template.title} Plus` : template.title,
    description: `${template.description} Built from ${scanSummary}.`,
    ingredients: template.ingredients,
    instructions: template.instructions,
    tags: [...template.tags, goal],
    nutrition: template.nutrition,
    source: "generated",
    isFavorite: false,
    isCooked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function saveGeneratedRecipes(recipes) {
  return createManyRecipes(
    recipes.map((recipe) => ({
      id: recipe.id,
      userId: recipe.userId,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      nutritionJson: recipe.nutrition,
      source: recipe.source,
    }))
  );
}

function listRecipeHistory(userId) {
  return findRecipesByUserId(userId);
}

async function setRecipeFavorite(userId, recipeId, isFavorite) {
  const recipe = await findRecipeByIdForUser(recipeId, userId);

  if (!recipe) {
    const error = new Error("Recipe not found.");
    error.statusCode = 404;
    throw error;
  }

  const sourceSet = new Set((recipe.source || "").split("|").filter(Boolean));

  if (isFavorite) {
    sourceSet.add("favorite:true");
  } else {
    sourceSet.delete("favorite:true");
  }

  return updateRecipe(recipe.id, {
    source: Array.from(sourceSet).join("|") || "generated",
  });
}

async function setRecipeCooked(userId, recipeId) {
  const recipe = await findRecipeByIdForUser(recipeId, userId);

  if (!recipe) {
    const error = new Error("Recipe not found.");
    error.statusCode = 404;
    throw error;
  }

  const sourceSet = new Set((recipe.source || "").split("|").filter(Boolean));
  sourceSet.add("cooked:true");

  return updateRecipe(recipe.id, {
    source: Array.from(sourceSet).join("|"),
  });
}

module.exports = {
  buildRecipeRecommendations,
  saveGeneratedRecipes,
  listRecipeHistory,
  setRecipeFavorite,
  setRecipeCooked,
};
