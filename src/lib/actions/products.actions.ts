"use server";
import { revalidateTag } from "next/cache";
import z from "zod";
import path from "path";
import fs from "fs/promises";
import { Ingredient, ProductImage } from "@prisma/client";
import { getUser } from "../user";
import { prisma } from "../prisma";
import { createRecipeSchema } from "../validations/recipe.schema";
import { toStorageUnit } from "../units";

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
  //   stock: z
  //     .number()
  //     .min(0)
  //     .optional()
  //     .or(z.nan().transform(() => undefined)),
});

export const createProduct = async (formData: FormData) => {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") throw new Error("No autorizado");

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    isActive: formData.get("isActive") === "true",
    saleAmount: Number(formData.get("saleAmount")),
    saleUnit: formData.get("saleUnit") as string,
  };

  const result = createProductSchema.safeParse(raw);
  if (!result.success)
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));

  const images = formData.getAll("images") as File[];
  const savedImages = await Promise.all(
    images.map(async (image, index) => {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
      const folder = path.join(process.cwd(), "public/products");
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(path.join(folder, filename), buffer);
      return { url: `/products/${filename}`, position: index };
    }),
  );

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
        name: parsed.data.name,
        yield: parsed.data.yield,
        yieldUnit: parsed.data.yieldUnit,
        items: {
          create: parsed.data.items.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: toStorageUnit(item.quantity, unitMap[item.ingredientId]),
          })),
        },
      },
    });
    finalRecipeId = recipe.id;
  }

  const product = await prisma.product.create({
    data: {
      ...result.data,
      images: { create: savedImages },
      manualCost: manualCost ? Number(manualCost) : null,
      recipeId: finalRecipeId,
    },
  });

  revalidateTag("products", "");
  return { ...product, price: Number(product.price) };
};
export const deleteProductImageById = async (
  imageIds: number[],
  slug: string,
) => {
  await prisma.productimage.deleteMany({
    where: { id: { in: imageIds } },
  });

  revalidateTag("products", "");
  revalidateTag(`product-${slug}`, "");
};

export const toggleProductActive = async (id: number, isActive: boolean) => {
  await prisma.product.update({
    where: { id },
    data: { isActive: !isActive },
  });
  revalidateTag("products", "");
};

export const deleteProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
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

  await prisma.product.delete({ where: { id } });

  revalidateTag("products", "");
};

export const updateProduct = async (formData: FormData) => {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  // Capturamos el ID del producto a editar
  const id = Number(formData.get("id"));
  if (!id) throw new Error("ID de producto no provisto");

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    isActive: formData.get("isActive") === "true",
    saleAmount: Number(formData.get("saleAmount")),
    saleUnit: formData.get("saleUnit") as string,
  };

  const result = createProductSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));
  }

  // Procesamos las imágenes NUEVAS si es que subieron alguna
  const images = formData.getAll("images") as File[];
  // Filtramos por si viene un File vacío
  const validImages = images.filter((img) => img.name && img.size > 0);

  const savedImages = await Promise.all(
    validImages.map(async (image, index) => {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
      const folder = path.join(process.cwd(), "public/products");
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(path.join(folder, filename), buffer);
      return { url: `/products/${filename}`, position: index };
    }),
  );

  // Actualizamos en Prisma
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...result.data,
      // Si hay imágenes nuevas, las agregamos a la relación sin pisar las viejas
      images: savedImages.length > 0 ? { create: savedImages } : undefined,
    },
  });

  // Revalidamos los tags de Next.js para que impacte el cambio
  revalidateTag("products", "");
  revalidateTag(`product-${product.slug}`, "");
  return {
    ...product,
    price: Number(product.price),
    saleAmount: Number(product.saleAmount),
    manualCost: product.manualCost ? Number(product.manualCost) : null,
  };
};

export const updateProductCost = async (
  productId: number,
  cost: { type: "manual"; value: number } | { type: "recipe"; value: number },
) => {
  await prisma.product.update({
    where: { id: productId },
    data: {
      manualCost: cost.type === "manual" ? cost.value : null,
      recipeId: cost.type === "recipe" ? cost.value : null,
    },
  });
  revalidateTag("products", "");
};
