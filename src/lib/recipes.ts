"use server";
import { prisma } from "@/src/lib/prisma";
import { RecipeItemType } from "../app/types/recipe.type";
import { getCurrentTenant } from "./tenant/tenant";
import { requireRole } from "./auth/role";
import { Role } from "@prisma/client";

import { cacheLife, cacheTag } from "next/cache";
import { withOrg } from "./auth/with-org";

export const getRecipesCached = async (organizationId: string) => {
  "use cache";
  cacheTag(`recipes-${organizationId}`);
  cacheLife("max");

  return prisma.recipe.findMany({
    where: { organizationId },
  });
};

export async function getRecipes() {
  return withOrg([Role.OWNER, Role.ADMIN, Role.STAFF], getRecipesCached);
}

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

export const getRecipesSelectCached = async (organizationId: string) => {
  "use cache";
  cacheTag(`recipes-${organizationId}`);
  cacheLife("max");

  const recipes = await prisma.recipe.findMany({
    where: {
      organizationId: organizationId,
    },
    select: { id: true, name: true },
  });
  if (recipes.length === 0) return [];

  return recipes;
};

export const getRecipesSelect = async () => {
  return withOrg([Role.OWNER, Role.ADMIN, Role.STAFF], getRecipesSelectCached);
};
