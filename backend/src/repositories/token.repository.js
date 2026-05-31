const { prisma } = require("../config/database");

function createRefreshToken(data) {
  return prisma.refreshToken.create({ data });
}

function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

function revokeRefreshToken(id) {
  return prisma.refreshToken.update({
    where: { id },
    data: { revokedAt: new Date() },
  });
}

function createVerificationToken(data) {
  return prisma.emailVerificationToken.create({ data });
}

function findVerificationToken(token) {
  return prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

function useVerificationToken(id) {
  return prisma.emailVerificationToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

function createPasswordResetToken(data) {
  return prisma.passwordResetToken.create({ data });
}

function findPasswordResetToken(token) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

function usePasswordResetToken(id) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  createVerificationToken,
  findVerificationToken,
  useVerificationToken,
  createPasswordResetToken,
  findPasswordResetToken,
  usePasswordResetToken,
};
