"use client";
import React, { useEffect, useState } from "react";
import { RecipeWithCostType } from "@/src/app/types/recipe.type";
import RecipeCard from "../../components/recipes/RecipeCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
