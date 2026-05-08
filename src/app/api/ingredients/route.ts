import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import z from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  unit: z.string().min(1, "La unidad es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  stock: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

export const updateIngredientsSchema = ingredientSchema.partial().extend({
  id: z.number(),
});

export type IngredientType = z.infer<typeof ingredientSchema>;
export type UpdateIngredientType = z.infer<typeof updateIngredientsSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ingredientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { name, unit, price, stock } = parsed.data;

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        unit,
        price: new Prisma.Decimal(price),
        stock: stock !== undefined ? new Prisma.Decimal(stock as number) : null,
      },
    });

    return NextResponse.json(ingredient);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el ingrediente" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los ingredientes" },
      { status: 500 },
    );
  }
}
