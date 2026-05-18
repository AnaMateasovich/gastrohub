"use client";
import ProductCard from "@/src/app/(main)/components/ProductCard";
import { ProductType } from "@/src/app/types/product.type";
import { useEffect, useState } from "react";


type Props = {
  products: ProductType[]
}
const ProductListAdmin = ({products} : Props) => {

  const [productsList, setProductsList] = useState<ProductType[]>([])

  const handleDeleteProduct = async (id: number) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id))
  }

  useEffect(() => {
    setProductsList(products)
  }, [products])
  
  return (
    <section>
      {products.map((product, index) => (
        <div key={product.id}>
          <ProductCard product={product} mode="admin" onDeleteAdmin={handleDeleteProduct} priority={index < 3} routerPush="/admin/productos"/>
        </div>
      ))}
    </section>
  );
};

export default ProductListAdmin;
