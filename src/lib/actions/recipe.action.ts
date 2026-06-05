"use server";
import { Ingredient } from "@prisma/client";
import { prisma } from "../prisma";
import {
  createRecipeSchema,
  CreateRecipeType,
  updateRecipeSchema,
  UpdateRecipeType,
} from "../validations/recipe.schema";
import { revalidateTag } from "next/cache";
import { toStorageUnit } from "../units";

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
          quantity: toStorageUnit(item.quantity, unitMap[item.ingredientId]),
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

export const updateRecipe = async (data: UpdateRecipeType) => {
  const parsed = updateRecipeSchema.safeParse(data);
  if (!parsed.success) throw new Error("Datos inválidos");

  const recipeId = parsed.data.id

  const ingredientIds = parsed.data.items.map((i) => i.ingredientId);
  const ingredients = await prisma.ingredient.findMany({
    where: { id: { in: ingredientIds } },
    select: { id: true, unit: true },
  });
  const unitMap = Object.fromEntries(
    ingredients.map((i: Ingredient) => [i.id, i.unit]),
  );

  const recipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      name: parsed.data.name,
      yield: parsed.data.yield,
      yieldUnit: parsed.data.yieldUnit,
      items: {
        deleteMany: {},
        create: parsed.data.items.map((item) => ({
          ingredientId: item.ingredientId,
          quantity: toStorageUnit(item.quantity, unitMap[item.ingredientId]),
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
  await prisma.product.updateMany({
    where: { recipeId: id },
    data: { recipeId: null },
  });
  await prisma.recipe.delete({ where: { id } });
  revalidateTag("products", "");
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
