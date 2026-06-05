"use server";
import { prisma } from "@/src/lib/prisma";
import { RecipeItemType } from "../app/types/recipe.type";

export const getRecipes = async () => {
  const recipes = await prisma.recipe.findMany();
  if (recipes.length === 0) return [];
  return recipes;
};

export const getRecipeByIdWithItems = async (id: number) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
    include: {
      items: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  return {
    ...recipe,
    yield: recipe.yield.toString(),
    createdAt: recipe.createdAt?.toISOString() ?? null,
    updatedAt: recipe.updatedAt?.toISOString() ?? null,
    items: recipe.items.map((item: RecipeItemType) => ({
      ...item,
      quantity: item.quantity.toString(),
      ingredient: {
        ...item.ingredient,
        price: Number(item.ingredient.price),
        stock: Number(item.ingredient.stock),
        updatedAt: item.ingredient.updatedAt?.toISOString() ?? null,
      },
    })),
  };
};

export const assignRecipeToProduct = async (
  productId: number,
  recipeId: number,
) => {
  await prisma.product.update({
    where: { id: productId },
    data: { recipeId },
  });
};

export const getRecipesSelect = async () => {
  const recipes = await prisma.recipe.findMany({
    select: { id: true, name: true },
  });
  if (recipes.length === 0) return [];
  return recipes;
};
