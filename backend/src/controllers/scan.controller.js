const { processFoodScan } = require("../services/scan.service");

async function scanFood(req, res, next) {
  try {
    const imagePath = req.file?.path || req.body.imagePath;

    if (!imagePath) {
      const error = new Error("image file or imagePath is required.");
      error.statusCode = 400;
      throw error;
    }

    const scanResult = await processFoodScan({
      userId: req.user.id,
      imagePath,
      imageUrl: req.body.imageUrl,
      notes: req.body.notes,
    });

    res.status(201).json({
      success: true,
      message: "Food scan processed successfully.",
      data: scanResult,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  scanFood,
};
