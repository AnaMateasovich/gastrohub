"use server"
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { Product } from "@prisma/client";
import {
  ProductWithRecipeType,
  RecipeItemType,
} from "../app/types/recipe.type";
import { getProductCost, getProductProfit } from "./costs";

export const getProducts = async () => {
  "use cache";
  cacheTag("products");
  cacheLife("max");
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  return products.map((product: Product) => ({
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    extraCost: Number(product.extraCost),
    saleAmount: Number(product.saleAmount),
    manualCost: product.manualCost ? Number(product.manualCost) : null,
  }));
};

export const getProductsAdmin = async () => {
  "use cache";
  cacheTag("products");
  cacheLife("max");

  const products = await prisma.product.findMany({
    include: {
      images: {
        orderBy: { position: "asc" },
        take: 1,
      },
      recipe: {
        include: {
          items: {
            include: { ingredient: true },
          },
        },
      },
    },
  });

  return products.map((product: ProductWithRecipeType) => {
    const mapped = {
      ...product,
      price: Number(product.price),
      saleAmount: Number(product.saleAmount),
      manualCost: product.manualCost ? Number(product.manualCost) : null,
      extraCost: product.extraCost ? Number(product.extraCost) : null,
      recipe: product.recipe
        ? {
            ...product.recipe,
            yield: Number(product.recipe.yield),
            items: product.recipe.items.map((item: RecipeItemType) => ({
              ...item,
              quantity: Number(item.quantity),
              ingredient: {
                ...item.ingredient,
                price: Number(item.ingredient.price),
                stock: item.ingredient.stock
                  ? Number(item.ingredient.stock)
                  : null,
              },
            })),
          }
        : null,
    };

    return {
      ...mapped,
      cost: getProductCost(mapped as ProductWithRecipeType),
      profit: getProductProfit(mapped as ProductWithRecipeType),
    };
  });
};
export const getProductBySlug = async (slug: string) => {
  "use cache";
  cacheTag(`product-${slug}`);
  cacheTag("products");
  cacheLife("max");
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      recipe: {
        include: {
          items: {
            include: { ingredient: true },
          },
        },
      },
    },
  });
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    extraCost: Number(product.extraCost),
    saleAmount: Number(product.saleAmount),
    manualCost: product.manualCost ? Number(product.manualCost) : null,
    recipe: product.recipe
      ? {
          ...product.recipe,
          yield: Number(product.recipe.yield),
          items: product.recipe.items.map((item: RecipeItemType) => ({
            ...item,
            quantity: Number(item.quantity),
            ingredient: {
              ...item.ingredient,
              price: Number(item.ingredient.price),
              stock: item.ingredient.stock
                ? Number(item.ingredient.stock)
                : null,
            },
          })),
        }
      : null,
  };
};


export async function checkSlugAvailable(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  return !product;
}