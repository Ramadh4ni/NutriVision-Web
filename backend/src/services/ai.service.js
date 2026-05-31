const path = require("path");
const { spawn } = require("child_process");

const { env } = require("../config/env");
const { FOOD_LABELS } = require("../constants/food-labels");
const { NUTRITION_MAP } = require("../constants/nutrition-map");

function detectFoodItems(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, "../python/predict_food.py");
    const modelDir = env.MODEL_DIR;
    const args = [scriptPath, "--model-dir", modelDir, "--image-path", imagePath];

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

      try {
        const parsed = JSON.parse(stdout);
        const label = FOOD_LABELS[parsed.predictedIndex] || `class_${parsed.predictedIndex}`;
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

function estimateNutrition(detectedItems) {
  const primary = detectedItems[0];
  return NUTRITION_MAP[primary] || NUTRITION_MAP.default;
}

module.exports = {
  detectFoodItems,
  estimateNutrition,
};
