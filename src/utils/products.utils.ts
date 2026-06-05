import { Product } from "@prisma/client";
import { ProductType } from "../app/types/product.type";

export function mapProduct(product: Product) {
  return {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    extraCost: Number(product.extraCost),
    saleAmount: Number(product.saleAmount),
    updatedAt: new Date(product.updatedAt) ?? null,
    manualCost: product.manualCost ? Number(product.manualCost) : null,
  };
}
