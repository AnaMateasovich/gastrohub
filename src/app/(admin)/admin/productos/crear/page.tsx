import React from 'react'
import FormCreateProduct from '../../../components/FormCreateProduct'
import { getRecipesSelect } from '@/src/lib/recipes';

const page = async () => {
  const recipes = await getRecipesSelect();
  return (
    <div className="px-4">
      <FormCreateProduct recipes={recipes} />
    </div>
  );
};


export default page