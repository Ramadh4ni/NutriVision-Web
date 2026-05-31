require("./config/env");

const app = require("./app");
const { env } = require("./config/env");
const { logger } = require("./config/logger");
const { prisma } = require("./config/database");

async function bootstrap() {
  await prisma.$connect();
  logger.info("Database connected successfully.");

  app.listen(env.PORT, () => {
    logger.info(`NutriVision backend listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error(error, "Failed to start NutriVision backend.");
  process.exit(1);
});
