import CreateIngredientForm from "@/src/app/(admin)/components/forms/CreateIngredientForm";
import BackButton from "@/src/app/(main)/components/BackButton";
import { prisma } from "@/src/lib/prisma";
import { Suspense } from "react";

async function EditIngredientContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton url={"/admin/menu/insumos"}/>
        <h3 className="text-xl font-bold">Editar ingrediente</h3>
      </div>
      <CreateIngredientForm ingredientToEdit={serializedIngredient} />
    </div>
  );
}

const EditIngredientPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <EditIngredientContent params={params} />
      </Suspense>
    </div>
  );
};

export default EditIngredientPage;
