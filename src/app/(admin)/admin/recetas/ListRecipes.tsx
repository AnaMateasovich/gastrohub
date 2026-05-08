"use client";
import React, { useEffect, useState } from "react";
import RecipeCard from "../../components/RecipeCard";
import { getCosts } from "@/src/app/services/costs.service";
import { CostType } from "@/src/app/types/cost.type";

const ListRecipes = () => {
  const [recipes, setRecipes] = useState<CostType[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getCosts();
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (productId: number) => {
  setRecipes((prev) => prev.filter((r) => r.productId !== productId));
};
  return (
    <div className="flex flex-col gap-2">
      {recipes.map((recipe) => (
        <div key={recipe.productId} >
          <RecipeCard
            productId={recipe.productId}
            productName={recipe.productName}
            productPrice={recipe.productPrice}
            recipeCost={recipe.recipeCost}
            margin={recipe.margin}
            marginPercent={recipe.marginPercent}
            hasRecipe={recipe.hasRecipe}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default ListRecipes;
