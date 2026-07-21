"use server";
import { prisma } from "@/src/lib/prisma";
import { RecipeItemType } from "../app/types/recipe.type";
import { getCurrentTenant } from "./tenant";
import { requireRole } from "./auth/role";
import { Role } from "@prisma/client";

export const getRecipes = async () => {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const recipes = await prisma.recipe.findMany({
    where: {
      organizationId: session.organizationId,
    },
  });
  if (recipes.length === 0) return [];
  return recipes;
};

export const getRecipeByIdWithItems = async (id: number) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id), organizationId: session.organizationId },
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
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  await prisma.product.update({
    where: { id: productId, organizationId: session.organizationId },
    data: { recipeId },
  });
};

export const getRecipesSelect = async () => {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const recipes = await prisma.recipe.findMany({
    select: { id: true, name: true },
    where: {
      organizationId: session.organizationId,
    },
  });
  if (recipes.length === 0) return [];
  return recipes;
};
