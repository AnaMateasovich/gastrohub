import BackButton from "@/src/app/(main)/components/BackButton";
import Link from "next/link";
import { Suspense } from "react";
import ListRecipes from "./ListRecipes";
import { RecipeWithCostType } from "@/src/app/types/recipe.type";
import { getRecipesWithCost } from "@/src/lib/costs";

const page = () => {
  return (
    <section className="mx-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">Recetas</h1>
        </div>
        <Link href="/admin/recetas/crear" className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm">
          Crear nueva +
        </Link>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <RecipesSection />
      </Suspense>
    </section>
  );
};

const RecipesSection = async () => {
  const recipes: RecipeWithCostType[] = await getRecipesWithCost();
  return <ListRecipes recipes={recipes} />;
};

export default page;
