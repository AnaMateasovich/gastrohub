"use client";
import {
  ProductType,
  ProductWithRecipeAndCostsType,
} from "@/src/app/types/product.type";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

type Props = {
  products: ProductWithRecipeAndCostsType[];
};
const ProductListAdmin = ({ products }: Props) => {
  const [productsList, setProductsList] = useState<
    ProductWithRecipeAndCostsType[]
  >([]);

  const handleDeleteProduct = async (id: number) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    setProductsList(products);
  }, [products]);
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <div key={product.id}>
          <ProductCard
            product={product}
            onDelete={handleDeleteProduct}
            routerPush="/admin/productos"
          />
        </div>
      ))}
    </section>
  );
};

export default ProductListAdmin;
