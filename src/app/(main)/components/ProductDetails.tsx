"use server";
import Button from "./Button";
import {
  ProductImageType,
  ProductType,
  ProductWithRecipeAndCostsType,
} from "../../types/product.type";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { getProductCost, getProductProfit } from "@/src/lib/costs";
import RecipeProduct from "../../(admin)/components/RecipeProduct";

type Props = {
  product: ProductWithRecipeAndCostsType;
  mode: "client" | "admin";
};
const ProductDetails = async ({ product, mode = "client" }: Props) => {
  const { profit, profitPercent } = getProductProfit(product) ?? {};

  return (
    <>
      <div className="relative self-stretch w-full h-[400px] overflow-hidden flex-shrink-0">
        {product.images.map((image: ProductImageType) => (
          <Image
            priority
            key={image.id}
            src={image.url}
            alt={product.name}
            sizes="500px"
            fill
            className="object-cover"
          />
        ))}
      </div>
      <div className="m-4">
        {mode === "admin" ? (
          <div className="flex gap-3 items-center mb-2">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <span
              className={`bg-white px-3 rounded-full border text-sm ${product.isActive ? "text-green-600 border-green-600" : "text-orange-600 border-orange-600"}`}
            >
              {product.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        )}
        <p>{product.description}</p>
        {mode === "admin" ? (
          <>
            <div className="grid grid-cols-2 gap-2 w-full mt-3">
              <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                <p className="text-sm text-gray-700">Precio de venta</p>
                <p>${product.price}</p>
              </div>
              <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                <p className="text-sm text-gray-700">Se vende por</p>
                <p>{product.saleUnit ?? "No especificado"}</p>
              </div>
              <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                <p className="text-sm text-gray-700">Costo</p>
                <p>${getProductCost(product) ?? "No especificado"}</p>
              </div>
              <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                <p className="text-sm text-gray-700">Ganancia</p>
                {!profitPercent && !profit ? (
                  <p>No especificado</p>
                ) : (
                  <div className="flex gap-2">
                    {profit && <p className="text-green-600">${profit} </p>}
                    {profit && profitPercent && (
                      <p className="text-green-600">- </p>
                    )}
                    {profitPercent && (
                      <p className="text-green-600">{profitPercent}%</p>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                <p className="text-sm text-gray-700">Stock</p>
                <p>
                  {product.stock ?? "No especificado"}{" "}
                  {product.stock && product.saleUnit}
                </p>
              </div>
              <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                <p className="text-sm text-gray-700">Slug</p>
                <p>{product.slug ?? "No especificado"}</p>
              </div>
            </div>
            {product.recipe && (
              <div className="mt-4">
                <RecipeProduct recipe={product.recipe} />
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-4 mt-4">
            <div className="border border-gray-300 px-4 py-2 rounded-xl min-w-[120px]">
              <p>Peso</p>
              <p className="font-bold text-xl text-right">900 g</p>
            </div>
            <div className="border border-gray-300 px-4 py-2 rounded-xl min-w-[120px]">
              <p>Precio</p>
              <p className="font-bold text-xl text-right">${product.price}</p>
            </div>
          </div>
        )}
        {mode !== "admin" && <AddToCartButton product={product} />}
      </div>
    </>
  );
};

export default ProductDetails;
