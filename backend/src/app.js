const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { env } = require("./config/env");
const { logger, httpLogger } = require("./config/logger");
const { apiLimiter } = require("./middlewares/rate-limit.middleware");
const routesV1 = require("./routes/v1");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");
const { sanitizeBodyStrings } = require("./middlewares/sanitize.middleware");

const app = express();

// app.use(
//   cors({
//     origin: env.FRONTEND_URL,
//     credentials: true,
//   })
// );
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     crossOriginEmbedderPolicy: false,
//   })
// );

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isVercelPreview =
        origin.endsWith(".vercel.app") && origin.includes("dales-projects");

      if (allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by NutriVision CORS Security Policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

const path = require("path");

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBodyStrings);
app.use(httpLogger);
app.use(apiLimiter);

// Serve uploaded images statically with cross-origin headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "../uploads")),
);

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
