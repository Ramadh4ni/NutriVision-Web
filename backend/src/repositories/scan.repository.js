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

module.exports = {
  createScan,
  findLatestScanByUserId,
};
