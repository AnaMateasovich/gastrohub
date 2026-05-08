import CreateIngredientForm from "@/src/app/(admin)/components/CreateIngredientForm";
import { prisma } from "@/src/lib/prisma";
import React from "react";

const EditIngredientPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const ingredient = await prisma.ingredient.findUnique({
    where: { id: Number(id) },
  });

  const serializedIngredient = ingredient
    ? {
        ...ingredient,
        price: ingredient.price.toNumber(),
        stock: ingredient.stock ? Number(ingredient.stock) : undefined
      }
    : null;

  return (
    <div>
      <CreateIngredientForm ingredientToEdit={serializedIngredient} />
    </div>
  );
};

export default EditIngredientPage;
