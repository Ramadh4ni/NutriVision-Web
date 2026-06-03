const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const backendRoot = path.resolve(__dirname, "../..");

function resolveModelDir(modelDir) {
  if (!modelDir) {
    return path.resolve(backendRoot, "../model_3_best");
  }

  if (path.isAbsolute(modelDir)) {
    return modelDir;
  }

  return path.resolve(backendRoot, modelDir);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5050),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/nutrivision",
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || "nutrivision-access-secret",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "nutrivision-refresh-secret",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "google-client-id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  APP_BASE_URL: process.env.APP_BASE_URL || "http://localhost:5050",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || "smtp-user",
  SMTP_PASS: process.env.SMTP_PASS || "smtp-password",
  PYTHON_BIN: process.env.PYTHON_BIN || "python",
  MODEL_DIR: resolveModelDir(process.env.MODEL_DIR),
  GITHUB_MODELS_TOKEN: process.env.GITHUB_MODELS_TOKEN || "",
  GITHUB_MODELS_MODEL: process.env.GITHUB_MODELS_MODEL || "gpt-4o-mini",
  GITHUB_MODELS_ENDPOINT:
    process.env.GITHUB_MODELS_ENDPOINT ||
    "https://models.inference.ai.azure.com/chat/completions",
};

module.exports = {
  env,
};
