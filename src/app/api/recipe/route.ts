import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import z, { includes } from "zod";

export const recipeItemSchema = z.object({
  ingredientId: z.number(),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
});

export const createRecipeSchema = z.object({
  productId: z.number(),
  items: z.array(recipeItemSchema).min(1),
});

export type RecipeItemType = z.infer<typeof recipeItemSchema>;
export type CreateRecipeType = z.infer<typeof createRecipeSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createRecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { productId, items } = parsed.data;
    await prisma.recipeItem.deleteMany({ where: { productId } });

    const recipe = await prisma.recipeItem.createMany({
      data: items.map((item) => ({
        productId,
        ingredientId: item.ingredientId,
        quantity: new Prisma.Decimal(item.quantity),
      })),
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la receta" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const recipes = await prisma.recipeItem.findMany({
      where: productId ? { productId: Number(productId) } : {},
      include: {
        ingrendient: true,
        product: true,
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener las recetas" },
      { status: 500 },
    );
  }
}
