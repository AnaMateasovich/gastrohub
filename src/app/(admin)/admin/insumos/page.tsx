import React from "react";
import IngredientsList from "./IngredientsList";
import BackButton from "@/src/app/(main)/components/BackButton";
import Link from "next/link";

const page = () => {
  return (
    <section className="mx-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">Insumos</h1>
        </div>
        <Link href="/admin/insumos/crear" className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm">Crear nuevo +</Link>
      </div>
      <IngredientsList />
    </section>
  );
};

export default page;
