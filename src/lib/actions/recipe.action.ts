"use server";
import { Ingredient } from "@prisma/client";
import { prisma } from "../prisma";
import { toStorageUnit } from "../units";
import {
  createRecipeSchema,
  CreateRecipeType,
} from "../validations/recipe.schema";
import { revalidateTag } from "next/cache";

export const createRecipe = async (data: CreateRecipeType) => {
  const parsed = createRecipeSchema.safeParse(data);
  if (!parsed.success) throw new Error("Datos inválidos");

  const ingredientIds = parsed.data.items.map((i) => i.ingredientId);
  const ingredients = await prisma.ingredient.findMany({
    where: { id: { in: ingredientIds } },
    select: { id: true, unit: true },
  });
  const unitMap = Object.fromEntries(
    ingredients.map((i: Ingredient) => [i.id, i.unit]),
  );

  const recipe = await prisma.recipe.create({
    data: {
      name: parsed.data.name,
      yield: parsed.data.yield,
      yieldUnit: parsed.data.yieldUnit,
      items: {
        create: parsed.data.items.map((item) => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unit: unitMap[item.ingredientId],
        })),
      },
    },
  });

  return {
    ...recipe,
    yield: Number(recipe.yield),
  };
};

export const deleteRecipeById = async (id: number) => {
  await prisma.recipes.delete({ where: { id } });
};
export const assignRecipeToProduct = async (
  productId: number,
  recipeId: number,
) => {
  await prisma.product.update({
    where: { id: productId },
    data: {
      recipeId,
      manualCost: null,
    },
  });
  revalidateTag("products", "");
};
