require("./config/env");

const app = require("./app");
const { env } = require("./config/env");
const { logger } = require("./config/logger");
const { prisma } = require("./config/database");

// async function bootstrap() {
//   await prisma.$connect();
//   logger.info("Database connected successfully.");

//   app.listen(env.PORT, () => {
//     logger.info(`NutriVision backend listening on port ${env.PORT}`);
//   });
// }

// bootstrap().catch((error) => {
//   logger.error(error, "Failed to start NutriVision backend.");
//   process.exit(1);
// });

if (process.env.NODE_ENV !== "production") {
  async function startLocalServer() {
    try {
      await prisma.$connect();
      logger.info("Database connected successfully in local environment.");

      const PORT = env.PORT || 5050;
      app.listen(PORT, () => {
        logger.info(`NutriVision backend listening locally on port ${PORT}`);
      });
    } catch (error) {
      logger.error(error, "Failed to start NutriVision backend locally.");
      process.exit(1);
    }
  }

  startLocalServer();
} else {
  logger.info(
    "NutriVision backend initialized in Vercel Serverless environment.",
  );
}

module.exports = app;
