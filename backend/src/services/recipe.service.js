const { v4: uuidv4 } = require("uuid");

const {
  createManyRecipes,
  findRecipesByUserId,
  findRecipeByIdForUser,
  updateRecipe,
  findRecipesByScanId,
} = require("../repositories/recipe.repository");
const { generateRecipeRecommendationsLLM } = require("./ai.service");

function listRecipesByScanId(scanId) {
  return findRecipesByScanId(scanId);
}

/**
 * Builds recipe recommendations based on the user's goal and scan summary.
 * @param {Object} params - The parameters for building recommendations.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.goal - The user's goal (e.g., "bulking", "cutting").
 * @param {string} params.scanSummary - A summary of the user's latest food scan.
 * @returns {Array} An array of recipe recommendation objects.
 */
function buildRecipeRecommendationsFallback({ userId, goal, scanSummary, scanId = null, recipeCount = 4 }) {
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
    {
      title: "Shallot and Spinach Quinoa Salad",
      description: "Refreshing salad combining the sweetness of shallots with nutritious spinach and protein-packed quinoa.",
      ingredients: ["shallot", "spinach", "quinoa", "olive oil", "lemon juice"],
      instructions: [
        "Rinse and cook quinoa.",
        "Thinly slice shallots and toss with fresh baby spinach.",
        "Whisk olive oil and lemon juice to make dressing.",
        "Combine quinoa, salad greens, and dressing, then serve."
      ],
      tags: ["salad", "low-carb"],
      nutrition: { calories: 320, protein: 12, carbs: 45, fat: 12 },
    },
    {
      title: "Garlic Shrimp and Quinoa Bowl",
      description: "A nutritious bowl filled with succulent garlic shrimp, fluffy quinoa, and vibrant vegetables.",
      ingredients: ["shrimp", "garlic", "quinoa", "bell pepper", "broccoli"],
      instructions: [
        "Cook quinoa according to package instructions.",
        "Sauté minced garlic and shrimp in a pan until pink.",
        "Steam broccoli and bell peppers.",
        "Assemble the bowl with quinoa base, topped with shrimp and vegetables."
      ],
      tags: ["seafood", "high-protein"],
      nutrition: { calories: 450, protein: 35, carbs: 41, fat: 14 },
    },
    {
      title: "Beef and Broccoli Rice Plate",
      description: "A classic high-protein stir-fry of tender beef and fresh broccoli over fluffy rice.",
      ingredients: ["beef", "broccoli", "garlic", "rice", "soy sauce"],
      instructions: [
        "Slice beef into thin strips and marinate in soy sauce and minced garlic.",
        "Cook rice according to package directions.",
        "Stir-fry beef in a hot pan until browned, then add broccoli florets and a splash of water.",
        "Steam until broccoli is tender-crisp, and serve over rice."
      ],
      tags: ["beef", "high-protein"],
      nutrition: { calories: 550, protein: 38, carbs: 55, fat: 16 },
    },
    {
      title: "Chili Tomato Salmon",
      description: "Pan-seared salmon fillet topped with a spicy chili tomato relish.",
      ingredients: ["fish", "tomato", "chili", "onion", "lime juice"],
      instructions: [
        "Season salmon fillet with salt, pepper, and lime juice.",
        "Sear salmon in a hot pan for 4-5 minutes on each side.",
        "Sauté diced tomatoes, chopped onions, and sliced chilis in olive oil to create a relish.",
        "Spoon relish over salmon and serve."
      ],
      tags: ["fish", "seafood", "spicy"],
      nutrition: { calories: 420, protein: 34, carbs: 12, fat: 22 },
    },
    {
      title: "Healthy Egg and Cucumber Salad",
      description: "A light and fresh salad featuring hard-boiled eggs and crisp cucumbers.",
      ingredients: ["egg", "cucumber", "greek yogurt", "dill", "lemon juice"],
      instructions: [
        "Hard-boil the eggs, peel them, and chop them into cubes.",
        "Slice cucumber into thin half-moons.",
        "In a bowl, mix greek yogurt, lemon juice, chopped dill, salt, and pepper.",
        "Fold egg and cucumber into the dressing, chill, and serve."
      ],
      tags: ["egg", "vegetarian", "low-carb"],
      nutrition: { calories: 280, protein: 18, carbs: 8, fat: 19 },
    },
    {
      title: "Fresh Banana Oatmeal Bowl",
      description: "Warm, satisfying oatmeal topped with fresh banana slices and a pinch of cinnamon.",
      ingredients: ["banana", "oats", "almond milk", "honey", "cinnamon"],
      instructions: [
        "Cook oats with almond milk until creamy.",
        "Slice banana into rounds.",
        "Pour oatmeal into a bowl, top with banana slices, drizzle with honey, and sprinkle with cinnamon."
      ],
      tags: ["banana", "breakfast", "sweet"],
      nutrition: { calories: 340, protein: 9, carbs: 62, fat: 5 },
    },
  ];

  return templates.slice(0, recipeCount).map((template) => ({
    id: uuidv4(),
    userId,
    scanId,
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

async function buildRecipeRecommendations({
  userId,
  goal,
  detectedItems = [],
  scanSummary,
  profile,
  scanId = null,
  recipeCount = 4,
}) {
  try {
    const aiRecipes = await generateRecipeRecommendationsLLM({
      detectedItems,
      goal,
      profile,
      recipeCount,
    });

    if (aiRecipes.length === 0) {
      return buildRecipeRecommendationsFallback({ userId, goal, scanSummary, scanId, recipeCount });
    }

    return aiRecipes.map((recipe) => ({
      id: uuidv4(),
      userId,
      scanId,
      title: recipe.title || "AI Recipe",
      description: recipe.description || `AI recipe built from ${scanSummary}.`,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      tags: recipe.tags || [goal],
      nutrition: recipe.nutrition || {
        calories: 420,
        protein: 28,
        carbs: 45,
        fat: 14,
      },
      source: "ai:github-models",
      isFavorite: false,
      isCooked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  } catch (_error) {
    return buildRecipeRecommendationsFallback({ userId, goal, scanSummary, scanId, recipeCount });
  }
}

/**
 * Saves generated recipes to the database, reusing existing recipes if their title matches to prevent duplicates.
 * @param {Array} recipes - The list of recipes to save.
 * @returns {Promise<Array>} A promise resolving to the saved recipes.
 */
async function saveGeneratedRecipes(recipes) {
  if (!recipes || recipes.length === 0) return [];
  const userId = recipes[0].userId;
  const existing = await findRecipesByUserId(userId);
  
  const saved = [];
  for (const recipe of recipes) {
    const duplicate = existing.find(
      (r) => r.title.trim().toLowerCase() === recipe.title.trim().toLowerCase()
    );
    
    if (duplicate) {
      // Update scanId of the existing recipe to associate it with the current scan
      const updated = await updateRecipe(duplicate.id, { scanId: recipe.scanId });
      saved.push(updated);
    } else {
      // Create new recipe if it does not exist
      const createdList = await createManyRecipes([
        {
          id: recipe.id,
          userId: recipe.userId,
          scanId: recipe.scanId,
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          nutritionJson: recipe.nutrition,
          source: recipe.source,
        }
      ]);
      saved.push(createdList[0]);
    }
  }
  return saved;
}

/**
 * Lists the user's recipe history.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} A promise resolving to the list of recipes.
 */
function listRecipeHistory(userId) {
  return findRecipesByUserId(userId);
}

/**
 * Sets a recipe as a favorite for the user.
 * @param {string} userId - The ID of the user.
 * @param {string} recipeId - The ID of the recipe.
 * @param {boolean} isFavorite - Whether the recipe is a favorite.
 * @returns {Promise<Object>} A promise resolving to the updated recipe.
 */
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

/**
 * Sets a recipe as cooked for the user.
 * @param {string} userId - The ID of the user.
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise<Object>} A promise resolving to the updated recipe.
 */
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
  buildRecipeRecommendationsFallback,
  saveGeneratedRecipes,
  listRecipeHistory,
  setRecipeFavorite,
  setRecipeCooked,
  listRecipesByScanId,
};
