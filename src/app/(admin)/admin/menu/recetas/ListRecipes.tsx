"use client";
import React, { useEffect, useState } from "react";
import { CostType } from "@/src/app/types/cost.type";
import { RecipeWithCostType } from "@/src/app/types/recipe.type";
import { useRouter } from "next/router";
import RecipeCard from "../../../components/RecipeCard";

type Props = {
  recipes: RecipeWithCostType[]
} 

const ListRecipes = ({recipes}: Props) => {
  const [recipesList, setRecipesList] = useState<RecipeWithCostType[]>([]);

  const handleDelete = async (id: number) => {
    setRecipesList((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    setRecipesList(recipes)
  }, [recipes])
  

  return (
    <div className="flex flex-col gap-2">
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <RecipeCard
            recipe={recipe}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default ListRecipes;
