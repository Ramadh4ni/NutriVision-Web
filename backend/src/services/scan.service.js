const path = require("path");

const { detectFoodItems, estimateNutrition } = require("./ai.service");
const { createScan } = require("../repositories/scan.repository");

async function processFoodScan({ userId, imagePath, imageUrl = null, notes = null }) {
  const absoluteImagePath = path.resolve(imagePath);
  const inference = await detectFoodItems(absoluteImagePath);
  const nutrition = estimateNutrition(inference.detectedItems);

  const scan = await createScan({
    userId,
    imageUrl: imageUrl || absoluteImagePath,
    detectedItems: inference.detectedItems,
    nutritionJson: nutrition,
    aiRawOutput: inference,
  });

  return {
    id: scan.id,
    userId: scan.userId,
    imageUrl: scan.imageUrl,
    detectedItems: scan.detectedItems,
    estimatedNutrition: scan.nutritionJson,
    confidence: inference.confidence,
    notes,
    createdAt: scan.createdAt,
  };
}

module.exports = {
  processFoodScan,
};
