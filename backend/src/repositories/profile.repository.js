const { prisma } = require("../config/database");

function upsertProfile(userId, profile) {
  return prisma.userProfile.upsert({
    where: { userId },
    update: profile,
    create: {
      userId,
      ...profile,
    },
  });
}

function findProfileByUserId(userId) {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
}

module.exports = {
  upsertProfile,
  findProfileByUserId,
};
