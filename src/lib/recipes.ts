"use server"
import { prisma } from "@/src/lib/prisma";

export const getRecipes = async () => {
  const recipes = await prisma.recipe.findMany();
  if(recipes.length === 0) return []
  return recipes;
};

export const assignRecipeToProduct = async (productId: number, recipeId: number) => {
  await prisma.product.update({
    where: {id: productId},
    data: {recipeId}
  })
}

export const getRecipesSelect = async () => {
  const recipes = await prisma.recipe.findMany({
    select: {id: true, name: true}
  });
  if(recipes.length === 0) return []
  return recipes;
};