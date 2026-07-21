"use server";
import { revalidateTag } from "next/cache";
import z from "zod";
import path from "path";
import fs from "fs/promises";
import { Ingredient, ProductImage, Role } from "@prisma/client";
import { prisma } from "../prisma";
import { createRecipeSchema } from "../validations/recipe.schema";
import { toStorageUnit } from "../units";
import { mapProduct } from "@/src/utils/products.utils";
import { requireRole } from "../auth/role";
import { getCurrentTenant } from "../tenant";

const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener minúsculas, números y guiones",
    ),
  description: z.string().trim().optional().or(z.literal("")),
  price: z.number().min(0, "El precio no puede ser negativo"),
  isActive: z.boolean(),
  saleUnit: z.string().min(1),
  saleAmount: z.number().min(0.01),
  extraCost: z.number().min(0).optional().default(0),
  //   stock: z
  //     .number()
  //     .min(0)
  //     .optional()
  //     .or(z.nan().transform(() => undefined)),
});

export const createProduct = async (formData: FormData) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);
  const tenant = await getCurrentTenant();

  const imageUrls = formData.getAll("imageUrls") as string[];

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    isActive: formData.get("isActive") === "true",
    saleAmount: Number(formData.get("saleAmount")),
    saleUnit: formData.get("saleUnit") as string,
    extraCost: Number(formData.get("extraCost")) || 0,
  };

  const result = createProductSchema.safeParse(raw);
  if (!result.success)
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));

  // Costo: manual o receta
  const manualCost = formData.get("manualCost");
  const recipeId = formData.get("recipeId");

  // Si eligió receta nueva, primero la creamos
  const recipeDataRaw = formData.get("recipeData");
  let finalRecipeId: number | null = recipeId ? Number(recipeId) : null;

  if (recipeDataRaw) {
    const recipeData = JSON.parse(recipeDataRaw as string);
    const parsed = createRecipeSchema.safeParse(recipeData);
    if (!parsed.success) throw new Error("Datos de receta inválidos");

    const ingredientIds = parsed.data.items.map((i) => i.ingredientId);
    const ingredients = await prisma.ingredient.findMany({
      where: { id: { in: ingredientIds } },
      select: { id: true, unit: true },
    });
    const unitMap = Object.fromEntries(
      ingredients.map((i: Ingredient) => [i.id, i.unit]),
    );

    const recipe = await prisma.recipe.create({
      data: {
        organizationId: session.organizationId,
        name: parsed.data.name,
        yield: parsed.data.yield,
        yieldUnit: parsed.data.yieldUnit,
        items: {
          create: parsed.data.items.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: toStorageUnit(item.quantity, unitMap[item.ingredientId]),
            unit: unitMap[item.ingredientId],
          })),
        },
      },
    });
    finalRecipeId = recipe.id;
  }

  const product = await prisma.product.create({
    data: {
      organizationId: session.organizationId,
      ...result.data,
      manualCost: manualCost ? Number(manualCost) : null,
      recipeId: finalRecipeId,
    },
  });

  await prisma.productImage.createMany({
    data: imageUrls.map((url, i) => ({
      productId: product.id,
      url,
      position: i,
    })),
  });

  revalidateTag(`orders-${session.organizationId}`, "");

  return {
    ...product,
    price: Number(product.price),
    extraCost: Number(product.extraCost),
    manualCost: Number(product.manualCost),
    saleAmount: Number(product.saleAmount),
  };
};

export const deleteProductImageById = async (
  imageIds: number[],
  slug: string,
) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  await prisma.productImage.deleteMany({
  where: {
    id: {
      in: imageIds,
    },
    product: {
      organizationId: session.organizationId,
    },
  },
});

  revalidateTag(`orders-${session.organizationId}`, "");
  revalidateTag(`product-${slug}`, "");
};

export const toggleProductActive = async (id: number, isActive: boolean) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);
  await prisma.product.update({
    where: { id, organizationId: session.organizationId },
    data: { isActive: !isActive },
  });
  revalidateTag(`orders-${session.organizationId}`, "");
};

export const deleteProductById = async (id: number) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const product = await prisma.product.findUnique({
    where: { id, organizationId: session.organizationId },
    include: { images: true },
  });

  if (product?.images?.length) {
    await Promise.all(
      product.images.map((image: ProductImage) => {
        const filepath = path.join(process.cwd(), "public/products", image.url);
        return fs.unlink(filepath).catch(() => {});
      }),
    );
  }

  await prisma.product.delete({
    where: { id, organizationId: session.organizationId },
  });

  revalidateTag(`orders-${session.organizationId}`, "");
};

export const updateProduct = async (formData: FormData) => {
  const session = await requireRole([Role.ADMIN, Role.OWNER]);

  const id = Number(formData.get("id"));
  if (!id) throw new Error("ID de producto no provisto");

  const imageUrls = formData.getAll("imageUrls") as string[];

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    isActive: formData.get("isActive") === "true",
    saleAmount: Number(formData.get("saleAmount")),
    saleUnit: formData.get("saleUnit") as string,
    extraCost: Number(formData.get("extraCost")) || 0,
  };

  const result = createProductSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));
  }

  // Actualizamos en Prisma
  const product = await prisma.product.update({
    where: { id, organizationId: session.organizationId },
    data: {
      ...result.data,
    },
  });

  if (imageUrls.length > 0) {
    const existingCount = await prisma.productImage.count({
      where: { productId: product.id },
    });

    await prisma.productImage.createMany({
      data: imageUrls.map((url, i) => ({
        productId: product.id,
        url,
        position: existingCount + i,
      })),
    });
  }
  // Revalidamos los tags de Next.js para que impacte el cambio
  revalidateTag(`orders-${session.organizationId}`, "");
  revalidateTag(`product-${product.slug}`, "");
  return mapProduct(product);
};

export const updateProductCost = async (
  productId: number,
  cost: { type: "manual"; value: number } | { type: "recipe"; value: number },
) => {
  const session = await requireRole([Role.ADMIN, Role.OWNER]);

  await prisma.product.update({
    where: { id: productId, organizationId: session.organizationId },
    data: {
      manualCost: cost.type === "manual" ? cost.value : null,
      recipeId: cost.type === "recipe" ? cost.value : null,
    },
  });
  revalidateTag(`orders-${session.organizationId}`, "");
};
