import CreateIngredientForm from "@/src/app/(admin)/components/CreateIngredientForm";
import { prisma } from "@/src/lib/prisma";
import { Suspense } from "react";

async function EditIngredientContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
  });

  const serializedIngredient = ingredient
    ? {
        ...ingredient,
        price: ingredient.price.toNumber(),
        stock: ingredient.stock ? Number(ingredient.stock) : undefined,
      }
    : null;

  return <CreateIngredientForm ingredientToEdit={serializedIngredient} />;
}

const EditIngredientPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <EditIngredientContent params={params} />
      </Suspense>
    </div>
  );
};

export default EditIngredientPage;