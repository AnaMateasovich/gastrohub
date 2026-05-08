import FormCreateRecipe from "@/src/app/(admin)/components/FormCreateRecipe";
import BackButton from "@/src/app/(main)/components/BackButton";
import { prisma } from "@/src/lib/prisma";
import { Ingredient, RecipeItem } from "@prisma/client";
import React from "react";

type RecipeItemWithIngredient = RecipeItem & {
  ingredient: Ingredient;
};

const EditRecipePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const recipeItem = await prisma.recipeItem.findMany({
    where: { productId: Number(id) },
    include: { ingredient: true },
  });
  return (
    <section className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Editar receta</h1>
        </div>
      <FormCreateRecipe
        productId={Number(id)}
        defaultItems={recipeItem.map((item: RecipeItemWithIngredient) => ({
          ingredientId: item.ingredientId,
          quantity: Number(item.quantity),
        }))}
      />
    </section>
  );
};

export default EditRecipePage;
