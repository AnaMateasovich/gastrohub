import React, { Suspense } from "react";
import BackButton from "@/src/app/(main)/components/BackButton";
import FormCreateRecipe from "@/src/app/(admin)/components/forms/FormCreateRecipe";

const page = () => {

  return (
    <section className="mx-4">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="text-xl font-bold">Crear receta</h1>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <FormCreateRecipe />
      </Suspense>
    </section>
  );
};

export default page;
