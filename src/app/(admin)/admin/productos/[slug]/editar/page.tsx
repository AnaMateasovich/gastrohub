import FormCreateProduct from "@/src/app/(admin)/components/forms/FormCreateProduct";
import { ProductType } from "@/src/app/types/product.type";
import { getProductBySlug } from "@/src/lib/products";
import { getRecipesSelect } from "@/src/lib/recipes";
import React, { Suspense } from "react";

type Params = Promise<{ slug: string }>;

const ProductEditing = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  
  const [product, recipes] = await Promise.all([
    getProductBySlug(slug),
    getRecipesSelect(),
  ]);
  
  return (
    <section className="mx-4">
      <FormCreateProduct productToEdit={product} recipes={recipes}/>
    </section>
  );
};


export default function EditProductPage ({params} : {params: Params}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductEditing params={params}/>
    </Suspense>
  )
}
