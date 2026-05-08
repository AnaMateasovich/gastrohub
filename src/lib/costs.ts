// src/lib/costs.ts
import { prisma } from "./prisma";
import { Ingredient, Product, RecipeItem } from "@prisma/client";

type ProductWithRecipe = Product & {
  recipeItems: (RecipeItem & { ingredient: Ingredient })[];
};

export const getCostByProductId = async () => {
  const products = await prisma.product.findMany({
    include: {
      recipeItems: {
        include: { ingredient: true },
      },
    },
  });

  const costMap = new Map<number, number>();

  products.forEach((product: ProductWithRecipe) => {
    const recipeCost = product.recipeItems.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.ingredient.price);
    }, 0);
    costMap.set(product.id, recipeCost);
  });

  return costMap;
};