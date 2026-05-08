'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { ProductType } from "../app/types/product.type";
import { getProductsService } from "../app/services/products.service";

type ProductContextType = {
  products: ProductType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>
  fetchProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | null>(null);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ProductType[]>([]);

  const fetchProducts = async () => {
    const data = await getProductsService();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, fetchProducts, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
}
