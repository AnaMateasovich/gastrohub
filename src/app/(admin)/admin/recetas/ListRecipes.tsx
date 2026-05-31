"use client";
import React, { useEffect, useState } from "react";
import RecipeCard from "../../components/RecipeCard";
import { CostType } from "@/src/app/types/cost.type";
import { RecipeWithCostType } from "@/src/app/types/recipe.type";

type Props = {
  recipes: RecipeWithCostType[]
} 

const ListRecipes = ({recipes}: Props) => {
  const [recipesList, setRecipesList] = useState<CostType[]>([]);


  const handleDelete = async (productId: number) => {
    setRecipesList((prev) => prev.filter((r) => r.productId !== productId));
  };
  return (
    <div className="flex flex-col gap-2">
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <RecipeCard
            recipe={recipe}
          />
        </div>
      ))}
    </div>
  );
};

export default ListRecipes;
