"use client";
import ProductCard from "../components/ProductCard";
import { useCart } from "@/src/contexts/CartContext";
import { useProducts } from "@/src/contexts/ProductContext";
import { ProductType } from "../../types/product.type";

type ProductListProps = { products: ProductType[] };
const ProductList = ({ products }: ProductListProps) => {
  const { addProduct } = useCart();

  return (
    <div className="flex flex-col gap-2">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} onAdd={addProduct} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
