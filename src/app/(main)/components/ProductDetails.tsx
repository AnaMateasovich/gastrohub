"use server";
import {
  ProductImageType,
  ProductWithRecipeAndCostsType,
} from "../../types/product.type";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { getProductCost, getProductProfit } from "@/src/lib/costs";
import RecipeProduct from "../../(admin)/components/RecipeProduct";
import { ChevronRight, Leaf, Sparkles } from "lucide-react";

type Props = {
  product: ProductWithRecipeAndCostsType;
  mode: "client" | "admin";
};

const ProductDetails = async ({ product, mode = "client" }: Props) => {
  const { profit, profitPercent } = getProductProfit(product) ?? {};
  const images = product.images ?? [];
  const mainImage = images[0];
  const hasGallery = images.length > 1;

  return (
    <div className="md:max-w-[1100px] md:mx-auto md:px-6 md:py-8">
      {/* Breadcrumb — solo cliente */}
      {mode !== "admin" && (
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 mb-6">
          <Link href="/home" className="hover:text-[var(--color-primary-dark)]">
            Inicio
          </Link>
          <ChevronRight size={14} />
          <Link href="/productos" className="hover:text-[var(--color-primary-dark)]">
            Productos
          </Link>
          <ChevronRight size={14} />
          <span className="text-[var(--color-text-primary)]">{product.name}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:gap-10 md:items-start">
        {/* ─── Galería ─────────────────────────────────────────── */}
        <div className="md:w-1/2 md:flex-shrink-0">
          <div className="relative self-stretch w-full h-[400px] md:h-[480px] overflow-hidden md:rounded-3xl">
            {mainImage && (
              <Image
                priority
                key={mainImage.id}
                src={mainImage.url}
                alt={product.name}
                sizes="(max-width: 768px) 100vw, 500px"
                fill
                className="object-cover"
              />
            )}

            {mode !== "admin" && (
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-[var(--color-primary-dark)]">
                  <Leaf size={12} />
                  Artesanal
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails — solo si hay más de una imagen */}
          {hasGallery && (
            <div className="flex gap-2 mt-3 px-4 md:px-0 overflow-x-auto">
              {images.map((image: ProductImageType, i) => (
                <div
                  key={image.id}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 ${
                    i === 0 ? "border-[var(--color-primary)]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Contenido ───────────────────────────────────────── */}
        <div className="m-4 md:m-0 md:flex-1 md:pt-2">
          {mode === "admin" ? (
            <>
              <div className="flex gap-3 items-center mb-2">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <span
                  className={`bg-white px-3 rounded-full border text-sm ${
                    product.isActive
                      ? "text-green-600 border-green-600"
                      : "text-orange-600 border-orange-600"
                  }`}
                >
                  {product.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <p className="text-gray-600">{product.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mt-3">
                <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                  <p className="text-sm text-gray-700">Precio de venta</p>
                  <p>${product.price}</p>
                </div>
                <div className="bg-[var(--color-natural-bg)] py-2 px-4 rounded-md">
                  <p className="text-sm text-gray-700">Se vende por</p>
                  <p>
                    {product.saleAmount}
                    {product.saleUnit ?? "No especificado"}
                  </p>
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
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-primary-dark)] mb-2">
                <Sparkles size={14} />
                <span>Recién horneado</span>
              </div>

              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {product.name}
              </h1>

              <p className="text-gray-500 mt-3 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
               
                <span className="bg-[var(--color-natural-bg)] text-[var(--color-primary-dark)] text-xs font-medium px-3 py-1.5 rounded-full">
                  Hecho a mano
                </span>
                <span className="bg-[var(--color-natural-bg)] text-[var(--color-primary-dark)] text-xs font-medium px-3 py-1.5 rounded-full">
                  Sin conservantes
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl min-w-[110px]">
                  <p className="text-xs text-gray-500">Peso</p>
                  <p className="font-bold text-lg text-[var(--color-primary-dark)]">
                    900 g
                  </p>
                </div>
                <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl min-w-[110px]">
                  <p className="text-xs text-gray-500">Se vende por</p>
                  <p className="font-bold text-lg text-[var(--color-primary-dark)]">
                    {product.saleAmount} {product.saleUnit}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500">Precio</p>
                  <p className="text-3xl font-bold text-[var(--color-primary-dark)]">
                    ${product.price}
                  </p>
                </div>
              </div>

              <div className="mt-6 md:max-w-[320px]">
                <AddToCartButton product={product} />
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center md:text-left">
                Retiro en local o envío a domicilio · Pago al recibir
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;