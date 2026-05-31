const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const { createAccessToken, createRefreshToken, rotateRefreshToken } = require("./token.service");
const { sendVerificationEmail, sendPasswordResetEmail } = require("./email.service");
const { findUserByEmail, createUser, updateUser } = require("../repositories/user.repository");
const {
  createVerificationToken,
  findVerificationToken,
  useVerificationToken,
  createPasswordResetToken,
  findPasswordResetToken,
  usePasswordResetToken,
} = require("../repositories/token.repository");

async function registerUser({ email, password, fullName }) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    email,
    passwordHash,
    fullName: fullName || email.split("@")[0],
    role: "USER",
    isVerified: false,
    googleId: null,
  });

  const verificationToken = await createVerificationToken({
    userId: user.id,
    token: `verify-${crypto.randomUUID()}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
  const emailReceipt = sendVerificationEmail({ email: user.email, token: verificationToken.token });

  return {
    user: sanitizeUser(user),
    tokens: await issueTokens(user),
    verification: {
      token: verificationToken.token,
      emailReceipt,
    },
  };
}

async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user || !user.passwordHash) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: sanitizeUser(user),
    tokens: await issueTokens(user),
  };
}

function loginWithGoogle({ email, fullName, googleId }) {
  return upsertGoogleUser({ email, fullName, googleId });
}

async function upsertGoogleUser({ email, fullName, googleId }) {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    const user = await createUser({
      email,
      passwordHash: null,
      fullName: fullName || "Google User",
      role: "USER",
      isVerified: true,
      googleId: googleId || crypto.randomUUID(),
    });

    return {
      user: sanitizeUser(user),
      tokens: await issueTokens(user),
    };
  }

  const user = await updateUser(existingUser.id, {
    isVerified: true,
    googleId: googleId || existingUser.googleId,
  });

  return {
    user: sanitizeUser(user),
    tokens: await issueTokens(user),
  };
}

function refreshSession(refreshToken) {
  return rotateRefreshToken(refreshToken);
}

async function verifyEmailToken(token) {
  const verificationToken = await findVerificationToken(token);

  if (!verificationToken) {
    const error = new Error("Verification token is invalid.");
    error.statusCode = 400;
    throw error;
  }

  if (verificationToken.usedAt) {
    const error = new Error("Verification token has already been used.");
    error.statusCode = 400;
    throw error;
  }

  if (new Date(verificationToken.expiresAt) < new Date()) {
    const error = new Error("Verification token has expired.");
    error.statusCode = 400;
    throw error;
  }

  await useVerificationToken(verificationToken.id);
  const user = await updateUser(verificationToken.userId, {
    isVerified: true,
  });

  return sanitizeUser(user);
}

async function createPasswordReset(email) {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      delivered: true,
    };
  }

  const tokenEntry = await createPasswordResetToken({
    userId: user.id,
    token: `reset-${crypto.randomUUID()}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
  });
  const emailReceipt = sendPasswordResetEmail({ email: user.email, token: tokenEntry.token });

  return {
    delivered: true,
    token: tokenEntry.token,
    emailReceipt,
  };
}

async function resetPassword({ token, newPassword }) {
  const tokenEntry = await findPasswordResetToken(token);

  if (!tokenEntry) {
    const error = new Error("Reset token is invalid.");
    error.statusCode = 400;
    throw error;
  }

  if (tokenEntry.usedAt) {
    const error = new Error("Reset token has already been used.");
    error.statusCode = 400;
    throw error;
  }

  if (new Date(tokenEntry.expiresAt) < new Date()) {
    const error = new Error("Reset token has expired.");
    error.statusCode = 400;
    throw error;
  }

  const user = await updateUser(tokenEntry.userId, {
    passwordHash: await bcrypt.hash(newPassword, 10),
  });
  await usePasswordResetToken(tokenEntry.id);

  return sanitizeUser(user);
}

async function issueTokens(user) {
  return {
    accessToken: createAccessToken(user),
    refreshToken: await createRefreshToken(user),
  };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: String(user.role).toLowerCase(),
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  refreshSession,
  verifyEmailToken,
  createPasswordReset,
  resetPassword,
  sanitizeUser,
};
