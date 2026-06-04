const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const { env } = require("../config/env");
const { FOOD_LABELS } = require("../constants/food-labels");
const { NUTRITION_MAP } = require("../constants/nutrition-map");

/**
 * Detects food items in an image using a pre-trained model.
 * @param {string} imagePath - The path to the image file.
 * @returns {Promise<Object>} A promise resolving to the detected food items and their probabilities.
 */
async function detectFoodItems(imagePath) {
  // 1. Try stand-alone FastAPI AI service (port 8000 by default)
  try {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append("file", blob, path.basename(imagePath));

    const response = await fetch(`${aiUrl}/predict`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      const confidence = (data.confidence || 0) / 100; // API returns 0-100%, map to 0-1
      const label = data.food_name || FOOD_LABELS[data.class_index] || "unknown";

      console.log(`[AI Standalone Service] Success prediction: ${label} (${data.confidence}%)`);
      return {
        predictedIndex: data.class_index,
        detectedItems: [label],
        confidence: confidence,
        probabilities: [],
      };
    }
  } catch (error) {
    console.log("[AI Standalone Service] Standalone API not available or error occurred. Falling back to local python script execution...");
  }

  // 2. Fallback to child-process script execution
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, "../python/predict_food.py");
    const modelDir = env.MODEL_DIR;
    const args = [
      scriptPath,
      "--model-dir",
      modelDir,
      "--image-path",
      imagePath,
    ];

    const child = spawn(env.PYTHON_BIN, args, {
      cwd: path.resolve(__dirname, "../../"),
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        const error = new Error(stderr || "Model inference failed.");
        error.statusCode = 500;
        reject(error);
        return;
      }

      // Expecting stdout to be a JSON string with predictedIndex, confidence, and probabilities
      try {
        const parsed = JSON.parse(stdout);
        const label =
          FOOD_LABELS[parsed.predictedIndex] ||
          `class_${parsed.predictedIndex}`;
        resolve({
          predictedIndex: parsed.predictedIndex,
          detectedItems: [label],
          confidence: parsed.confidence,
          probabilities: parsed.probabilities,
        });
      } catch (_error) {
        const error = new Error("Unable to parse model inference response.");
        error.statusCode = 500;
        reject(error);
      }
    });
  });
}

/**
 * Estimates the nutritional information based on detected food items.
 * @param {string[]} detectedItems - An array of detected food item labels.
 * @returns {Object} An object containing estimated nutritional information.
 */
function estimateNutrition(detectedItems) {
  const primary = detectedItems[0];
  return NUTRITION_MAP[primary] || NUTRITION_MAP.default;
}

function sanitizeJsonResponse(content) {
  if (!content) return "";
  const trimmed = content.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/```$/, "")
      .trim();
  }
  return trimmed;
}

/**
 * Validates and cleans JSON response from LLM to match target schema exactly.
 * Ensures default values if the LLM output is malformed.
 */
function validateAndCleanRecipes(parsed) {
  if (!parsed || typeof parsed !== "object") return [];
  const rawRecipes = parsed.recipes;
  if (!Array.isArray(rawRecipes)) return [];

  const cleanedRecipes = [];
  for (const item of rawRecipes) {
    if (!item || typeof item !== "object") continue;

    // Essential structural check and clean defaults
    const title =
      typeof item.title === "string" && item.title.trim()
        ? item.title.trim()
        : "Healthy Alternative Recipe";
    const description =
      typeof item.description === "string" && item.description.trim()
        ? item.description.trim()
        : "A delicious nutrition-balanced meal recommendation.";

    // Ensure ingredients are array of strings
    const ingredients = [];
    if (Array.isArray(item.ingredients)) {
      for (const ing of item.ingredients) {
        if (typeof ing === "string" && ing.trim()) {
          ingredients.push(ing.trim());
        }
      }
    }
    if (ingredients.length === 0) {
      ingredients.push("fresh healthy ingredients");
    }

    // Ensure instructions are array of strings
    const instructions = [];
    if (Array.isArray(item.instructions)) {
      for (const inst of item.instructions) {
        if (typeof inst === "string" && inst.trim()) {
          instructions.push(inst.trim());
        }
      }
    }
    if (instructions.length === 0) {
      instructions.push(
        "Prepare and combine ingredients in a healthy cooking method.",
      );
    }

    // Ensure nutrition is mapped perfectly
    const rawNutrition = item.nutrition || {};
    const nutrition = {
      calories:
        typeof rawNutrition.calories === "number"
          ? Math.round(rawNutrition.calories)
          : 400,
      protein:
        typeof rawNutrition.protein === "number"
          ? Math.round(rawNutrition.protein)
          : 20,
      carbs:
        typeof rawNutrition.carbs === "number"
          ? Math.round(rawNutrition.carbs)
          : 45,
      fat:
        typeof rawNutrition.fat === "number"
          ? Math.round(rawNutrition.fat)
          : 12,
    };

    // Ensure tags are array of strings
    const tags = [];
    if (Array.isArray(item.tags)) {
      for (const t of item.tags) {
        if (typeof t === "string" && t.trim()) {
          tags.push(t.trim().toLowerCase());
        }
      }
    }

    cleanedRecipes.push({
      title,
      description,
      ingredients,
      instructions,
      nutrition,
      tags,
    });
  }

  return cleanedRecipes;
}

async function generateRecipeRecommendationsLLM({
  detectedItems = [],
  goal = "maintenance",
  profile = null,
  recipeCount = 8,
}) {
  if (!env.GITHUB_MODELS_TOKEN) {
    return [];
  }

  if (typeof fetch !== "function") {
    throw new Error("Global fetch is not available in this runtime.");
  }

  // Obtain estimated nutrition context based on detected food item class
  const primaryItem = detectedItems[0] || "default";
  const estNutrition = NUTRITION_MAP[primaryItem] || NUTRITION_MAP.default;

  // Build profile context string
  let profileContext = "";
  if (profile) {
    profileContext = `The user is a ${profile.age}-year-old ${profile.gender.toLowerCase()} with a height of ${profile.heightCm} cm, weight of ${profile.weightKg} kg, and activity level: ${profile.activityLevel.toLowerCase()}. `;
  }

  const prompt = `You are a professional nutrition and culinary expert assistant.
The user has scanned a list of food ingredients: "${detectedItems.join(", ")}".
The primary ingredient is estimated to contain: ${estNutrition.calories} kcal, ${estNutrition.protein}g protein, ${estNutrition.carbs}g carbs, and ${estNutrition.fat}g fat.
The user's physical profile: ${profileContext || "Not specified."}
The user's nutrition goal is: "${goal.toUpperCase()}".

Generate exactly ${recipeCount} healthy, creative, and tasty recipes.

CRITICAL RECIPE COMPOSITION RULES:
1. The recipes do NOT need to include all scanned ingredients in every dish.
2. Each recipe can selectively use a single scanned ingredient or mix 2 or more of the scanned ingredients.
3. Every recipe must include at least one or two of the scanned ingredients as a central component.
4. Ensure a good variety of dishes across the generated recommendations.

CRITICAL INSTRUCTIONS:
1. All generated recipe content (title, description, ingredients, instructions, tags) MUST be written exclusively in English. Do not use Indonesian or any other languages.
2. Return ONLY a valid JSON object. No conversational text, no markdown block wrappers around the JSON, just pure JSON conforming exactly to the schema.
3. The response format must be a JSON object containing a "recipes" key which is an array of recipe objects.

JSON Schema:
{
  "recipes": [
    {
      "title": "Recipe Title (English)",
      "description": "Short appetizing description in English",
      "ingredients": ["100g Ingredient A", "1 tbsp Ingredient B"],
      "instructions": ["Step 1 cooking instructions in English", "Step 2 cooking instructions"],
      "nutrition": {
        "calories": 450,
        "protein": 28,
        "carbs": 42,
        "fat": 14
      },
      "tags": ["high-protein", "low-carb"]
    }
  ]
}`;

  const payload = {
    model: env.GITHUB_MODELS_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a professional nutritionist. You always respond in English with a single, perfectly structured JSON object matching the requested schema.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  };

  const response = await fetch(env.GITHUB_MODELS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_MODELS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(errorText || "LLM recipe generation failed.");
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";
  const sanitized = sanitizeJsonResponse(content);

  try {
    const parsed = JSON.parse(sanitized);
    return validateAndCleanRecipes(parsed);
  } catch (error) {
    console.error("Failed to parse or validate LLM JSON output:", error);
    return [];
  }
}

module.exports = {
  detectFoodItems,
  estimateNutrition,
  generateRecipeRecommendationsLLM,
};
