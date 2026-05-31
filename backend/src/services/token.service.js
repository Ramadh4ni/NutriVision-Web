const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { createRefreshToken: createRefreshTokenRecord, findRefreshToken, revokeRefreshToken: revokeRefreshTokenRecord } = require("../repositories/token.repository");

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: String(user.role).toLowerCase(),
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
}

async function createRefreshToken(user) {
  const token = crypto.randomBytes(48).toString("hex");

  await createRefreshTokenRecord({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN)),
  });

  return token;
}

async function rotateRefreshToken(refreshToken) {
  const existingToken = await findRefreshToken(refreshToken);

  if (!existingToken || existingToken.revokedAt) {
    const error = new Error("Refresh token is invalid.");
    error.statusCode = 401;
    throw error;
  }

  if (new Date(existingToken.expiresAt) < new Date()) {
    const error = new Error("Refresh token has expired.");
    error.statusCode = 401;
    throw error;
  }

  await revokeRefreshTokenRecord(existingToken.id);
  const user = existingToken.user;

  return {
    accessToken: createAccessToken(user),
    refreshToken: await createRefreshToken(user),
  };
}

async function revokeRefreshToken(refreshToken) {
  const existingToken = await findRefreshToken(refreshToken);

  if (existingToken && !existingToken.revokedAt) {
    await revokeRefreshTokenRecord(existingToken.id);
  }
}

function parseDurationToMs(duration) {
  const amount = Number.parseInt(duration, 10);

  if (duration.endsWith("m")) {
    return amount * 60 * 1000;
  }

  if (duration.endsWith("h")) {
    return amount * 60 * 60 * 1000;
  }

  if (duration.endsWith("d")) {
    return amount * 24 * 60 * 60 * 1000;
  }

  return 7 * 24 * 60 * 60 * 1000;
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
};
