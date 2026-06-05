import FormCreateRecipe from "@/src/app/(admin)/components/FormCreateRecipe";
import BackButton from "@/src/app/(main)/components/BackButton";
import { prisma } from "@/src/lib/prisma";
import { getRecipeByIdWithItems } from "@/src/lib/recipes";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

const RecipeToEdit = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const recipe = await getRecipeByIdWithItems(Number(id))

  return (
    <section className="px-4">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Editar receta</h1>
      </div>
      <FormCreateRecipe recipeToEdit={recipe} />
    </section>
  );
};

const EditRecipePage = ({ params }: { params: Params }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipeToEdit params={params} />
    </Suspense>
  );
};

export default EditRecipePage;
