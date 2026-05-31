const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { env } = require("./config/env");
const { logger, httpLogger } = require("./config/logger");
const { apiLimiter } = require("./middlewares/rate-limit.middleware");
const routesV1 = require("./routes/v1");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");
const { sanitizeBodyStrings } = require("./middlewares/sanitize.middleware");

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBodyStrings);
app.use(httpLogger);
app.use(apiLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NutriVision backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", routesV1);
app.use(notFoundHandler);
app.use(errorHandler);

logger.info("Application middleware bootstrapped.");

module.exports = app;
