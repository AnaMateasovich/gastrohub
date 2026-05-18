import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { Product } from "@prisma/client";

export const getProducts = async () => {
  "use cache";
  cacheTag("products");
  cacheLife("max");
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        orderBy: {
          position: "asc"
        }
      }
    }
  });
  return products.map((product: Product) => ({
    ...product,
    price: Number(product.price),
  }));
};

export const getProductBySlug = async (slug: string) => {
  "use cache";

  cacheTag(`product-${slug}`);

  cacheLife("max");
  const product = await prisma.product.findUnique({
    where: {
      slug
    },
    include: {
      images: {
        orderBy: {
          position: 'asc'
        }
      },
    }
  })

  if(!product) return null 
  
  return{
    ...product,
    price: Number(product.price)
  }
}

export const deleteProductImageById = async (imageId: number,slug: string) => {
  "use cache";

  cacheTag(`product-${slug}`);

  cacheLife("max");
  const res = await prisma.productimage.delete({
    where: {id: imageId}
  })
}