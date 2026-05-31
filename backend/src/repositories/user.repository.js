const { prisma } = require("../config/database");

function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
}

function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
}

function createUser(data) {
  return prisma.user.create({ data });
}

function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
};
