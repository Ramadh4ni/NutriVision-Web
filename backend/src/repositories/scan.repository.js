const { prisma } = require("../config/database");

function createScan(data) {
  return prisma.foodScan.create({ data });
}

function findLatestScanByUserId(userId) {
  return prisma.foodScan.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

function findRecentScansByUserId(userId, minutes = 5) {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000);
  return prisma.foodScan.findMany({
    where: {
      userId,
      createdAt: {
        gte: cutoff,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  createScan,
  findLatestScanByUserId,
  findRecentScansByUserId,
};
