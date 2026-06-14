import { Product } from "@prisma/client";
import { ProductType } from "../app/types/product.type";
import { ProductWithRecipeType } from "../app/types/recipe.type";

export function mapProduct(product: ProductWithRecipeType) {
  return {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    extraCost: Number(product.extraCost),
    saleAmount: Number(product.saleAmount),
    manualCost: product.manualCost ? Number(product.manualCost) : null,
    updatedAt: product.updatedAt ? new Date(product.updatedAt) : null,
    recipe: product.recipe
      ? {
          ...product.recipe,
          yield: Number(product.recipe.yield),
          items: product.recipe.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            ingredient: {
              ...item.ingredient,
              price: Number(item.ingredient.price),
              stock: item.ingredient.stock ? Number(item.ingredient.stock) : null,
            },
          })),
        }
      : undefined,
  };
}