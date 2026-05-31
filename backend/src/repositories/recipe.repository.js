const { prisma } = require("../config/database");

function createManyRecipes(data) {
  return Promise.all(
    data.map((recipe) =>
      prisma.recipe.create({
        data: recipe,
      })
    )
  );
}

function findRecipesByUserId(userId) {
  return prisma.recipe.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

function findRecipeByIdForUser(id, userId) {
  return prisma.recipe.findFirst({
    where: { id, userId },
  });
}

function updateRecipe(id, data) {
  return prisma.recipe.update({
    where: { id },
    data,
  });
}

module.exports = {
  createManyRecipes,
  findRecipesByUserId,
  findRecipeByIdForUser,
  updateRecipe,
};
