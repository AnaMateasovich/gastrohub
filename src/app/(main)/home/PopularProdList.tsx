"use client";
import React, { useEffect, useState } from "react";
import { ProductType } from "../../types/product.type";
import { getProducts } from "../../services/products.service";
import PopularProductsCard from "../components/PopularProductsCard";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/src/contexts/ProductContext";

const PopularProdList = () => {
  const { products } = useProducts();

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      {products.map((product) => (
        <div key={product.id}>
          <PopularProductsCard
            imageSrc={product.src}
            name={product.name}
            price={product.price}
          />
        </div>
      ))}
    </div>
  );
};

export default PopularProdList;
