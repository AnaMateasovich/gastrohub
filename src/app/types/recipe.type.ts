import { IngredientType } from "../api/ingredients/route";
import { ProductType } from "./product.type";

export type RecipeItemType = {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  ingredient: IngredientType;
};

export type RecipeType = {
  id: number;
  name: string;
  yield: number;
  yieldUnit: string;
  items: RecipeItemType[];
};

export type ProductWithRecipeType = ProductType & {
  recipe?: RecipeType;
};

export type RecipeSelectType = {
  id: number;
  name: string;
};

export type RecipeWithCostType = RecipeType & {
  costPerUnit: number;
  totalCost: number;
};
