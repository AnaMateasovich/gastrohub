"use server";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { Product, Role } from "@prisma/client";
import {
  ProductWithRecipeType,
  RecipeItemType,
} from "../app/types/recipe.type";
import { getProductCost, getProductProfit } from "./costs";
import { requireRole } from "./auth/role";
import { withOrg } from "./auth/with-org";

export const getProductsCached = async (organizationId: string) => {
  "use cache";
  cacheTag(`products-${organizationId}`);
  cacheLife("max");

  const products = await prisma.product.findMany({
    where: { organizationId, isActive: true },
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

export async function getProducts() {
  return withOrg([Role.OWNER, Role.ADMIN, Role.STAFF], getProductsCached);
}

export const getProductsAdminCached = async (organizationId: string) => {
  "use cache";
  cacheTag(`products-${organizationId}`);
  cacheLife("max");

  const products = await prisma.product.findMany({
    where: {
      organizationId,
    },
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

export async function getProductsAdmin() {
  return withOrg([Role.OWNER, Role.ADMIN, Role.STAFF], getProductsAdminCached);
}

export const getProductBySlugCached = async (
  organizationId: string,
  slug: string,
) => {
  "use cache";
  cacheTag(`products-${organizationId}`);
  cacheTag(`product-${slug}`);
  cacheLife("max");

  const product = await prisma.product.findUnique({
    where: {
      organizationId_slug: {
        organizationId,
        slug,
      },
    },
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

export async function getProductBySlug(slug: string) {
  return withOrg(
    [Role.OWNER, Role.ADMIN, Role.STAFF],
    getProductBySlugCached,
    slug,
  );
}

export async function checkSlugAvailable(slug: string) {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const product = await prisma.product.findUnique({
    where: {
      organizationId_slug: {
        organizationId: session.organizationId,
        slug,
      },
    },
  });

  return !product;
}
