import React, { Suspense } from 'react'
import FormCreateProduct from '../../../components/forms/FormCreateProduct'
import { getRecipesSelect } from '@/src/lib/recipes';

async function CreateProductContent() {
  const recipes = await getRecipesSelect();
  return <FormCreateProduct recipes={recipes} />;
}

const page = async () => {
  return (
    <div className="px-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <CreateProductContent />
      </Suspense>
    </div>
  );
};

export default page