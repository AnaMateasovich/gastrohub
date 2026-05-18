"use client";
import ProductCard from "../components/ProductCard";
import { useCart } from "@/src/contexts/CartContext";
import { ProductType } from "../../types/product.type";

type ProductListProps = { products: ProductType[] };
const ProductList = ({ products }: ProductListProps) => {
  const { addProduct } = useCart();

  return (
    <ul className="flex flex-col gap-2">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} onAdd={addProduct} priority={index < 3 } routerPush="/productos"/>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
