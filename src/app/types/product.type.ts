import { ProductWithRecipeType } from "./recipe.type";

export type ProductImageType = {
  id: number;
  url: string;
  position: number;
  createdAt?: Date;
};

export type ProductType = {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  stock: number;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  saleUnit?: string;
  saleAmount?: number;
  recipeId?: number;
  manualCost?: number | null
  images: ProductImageType[];
};

export type ProductWithRecipeAndCostsType = ProductWithRecipeType & {
  cost: number | null;
  profit: { cost: number; profit: number; profitPercent: number } | null;
};