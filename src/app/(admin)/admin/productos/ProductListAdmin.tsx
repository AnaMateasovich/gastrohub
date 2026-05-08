"use client";
import ProductCard from "@/src/app/(main)/components/ProductCard";
import { useProducts } from "@/src/contexts/ProductContext";
import { useEffect } from "react";

const ProductListAdmin = () => {
  const { products, setProducts, fetchProducts } = useProducts();

  const handleDeleteProduct = async (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  useEffect(() => {
  fetchProducts();
}, []);
  return (
    <section>
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} mode="admin" onDeleteAdmin={handleDeleteProduct}/>
        </div>
      ))}
    </section>
  );
};

export default ProductListAdmin;
