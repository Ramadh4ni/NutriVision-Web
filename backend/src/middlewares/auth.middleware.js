const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { findUserById } = require("../repositories/user.repository");

const JWT_SECRET = env.JWT_ACCESS_SECRET;

async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authorization token is required.");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const token = authHeader.replace("Bearer ", "").trim();
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(payload.sub);

    if (!user) {
      const error = new Error("Authenticated user was not found.");
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    return next();
  } catch (_error) {
    const error = new Error("Invalid or expired token.");
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = {
  requireAuth,
  JWT_SECRET,
};
