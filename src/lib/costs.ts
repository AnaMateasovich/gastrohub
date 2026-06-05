// src/lib/costs.ts
import { ProductWithRecipeType, RecipeType } from "../app/types/recipe.type";
import { prisma } from "./prisma";
import { Ingredient, Product, RecipeItem } from "@prisma/client";
import { toDisplayUnit } from "./units";

// export const getCostByProductId = async () => {
//   const products = await prisma.product.findMany({
//     include: {
//       recipeItems: {
//         include: { ingredient: true },
//       },
//     },
//   });

//   const costMap = new Map<number, number>();

//   products.forEach((product: ProductWithRecipe) => {
//     const recipeCost = product.recipeItems.reduce((acc, item) => {
//       return acc + Number(item.quantity) * Number(item.ingredient.price);
//     }, 0);
//     costMap.set(product.id, recipeCost);
//   });

//   return costMap;
// };

export const getProductCost = (product: ProductWithRecipeType): number | null => {
  if (!product.recipe && !product.manualCost) return null;

  let cost = 0;

  if (product.recipe) {
    cost = product.recipe.items.reduce((acc, item) => {
      return acc + Number(item.ingredient.price) * Number(item.quantity);
    }, 0) * (Number(product.saleAmount) / Number(product.recipe.yield));
  } else {
    cost = product.manualCost!;
  }

  return cost + (product.extraCost ?? 0);
};

export const getProductProfit = (product: ProductWithRecipeType) => {
  const cost = getProductCost(product);
  if (cost === null) return null;

  const price = Number(product.price);
  const profit = price - cost;
  const profitPercent = Math.round((profit / price) * 100);

  return { cost, profit, profitPercent };
};



export const getRecipesWithCost = async () => {
  const recipes = await prisma.recipe.findMany({
    include: { items: { include: { ingredient: true } } },
  });

  return recipes.map((r: RecipeType) => {
    const items = r.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      ingredient: {
        ...item.ingredient,
        price: Number(item.ingredient.price),
        stock: item.ingredient.stock ? Number(item.ingredient.stock) : null,
      },
    }));

    const totalCost = items.reduce((acc, item) => {
      const unit = item.ingredient.unit; // "kg", "g", "l", "ml"
      
      // cantidad guardada en DB está en la unidad del ingrediente
      // la convertimos a la unidad base (g, ml, u)
      const quantityInBase = toDisplayUnit(item.quantity, unit);
      
      // el precio en DB es por la unidad del ingrediente (ej: precio por kg)
      // lo convertimos a precio por unidad base (precio por g)
      const pricePerBase = item.ingredient.price / toDisplayUnit(1, unit);
      
      return acc + pricePerBase * quantityInBase;
    }, 0);

    const yieldAmount = Number(r.yield);
    // el yield también hay que convertirlo a la unidad base
    const yieldInBase = toDisplayUnit(yieldAmount, r.yieldUnit);
    const costPerUnit = yieldInBase > 0 ? totalCost / yieldAmount : 0;

    return {
      ...r,
      yield: yieldAmount,
      items,
      totalCost: Math.round(totalCost * 100) / 100,
      costPerUnit: Math.round(costPerUnit * 100) / 100, // costo por g, ml, o u
    };
  });
};