const path = require("path");

const { detectFoodItems, estimateNutrition } = require("./ai.service");
const { createScan } = require("../repositories/scan.repository");

/**
 * Processes a food scan and saves the results.
 * @param {Object} param0 - The parameters for processing the scan.
 * @param {string} param0.userId - The ID of the user.
 * @param {string} param0.imagePath - The path to the scanned image.
 * @param {string} param0.imageUrl - The URL of the scanned image (optional).
 * @param {string} param0.notes - Additional notes for the scan (optional).
 * @returns {Promise<Object>} A promise resolving to the processed scan.
 */
async function processFoodScan({
  userId,
  imagePath,
  imageUrl = null,
  notes = null,
}) {
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
