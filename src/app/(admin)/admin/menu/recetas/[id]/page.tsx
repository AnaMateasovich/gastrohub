import { getRecipeByIdWithItems } from "@/src/lib/recipes";
import React, { Suspense } from "react";
import BackButton from "@/src/app/(main)/components/BackButton";
import { Pencil } from "lucide-react";
import Link from "next/link";
import RecipeProduct from "@/src/app/(admin)/components/recipes/RecipeProduct";

type Props = Promise<{ id: string }>;

const RecipePage = async ({ params }: { params: Props }) => {
  const { id } = await params;

  const recipe = await getRecipeByIdWithItems(Number(id));

  return (
    <section className="px-4 mt-1">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">Receta</h1>
        </div>
        <div className="bg-[var(--color-primary)] text-white p-2 rounded-sm">
          <Link href={`/admin/menu/recetas/${recipe.id}/editar`}>
            <Pencil size={20} />
          </Link>
        </div>
      </div>
      <RecipeProduct recipe={recipe} />
    </section>
  );
};

const Recipe = ({ params }: { params: Props }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipePage params={params} />
    </Suspense>
  );
};

export default Recipe;
