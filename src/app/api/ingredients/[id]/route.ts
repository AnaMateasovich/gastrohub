import { NextResponse } from "next/server";
import { updateIngredientsSchema } from "../route";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: rawId } = await params;

    const id = parseInt(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const body = await req.json();

    const parsed = updateIngredientsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { name, unit, price, stock } = parsed.data;
    const existing = await prisma.ingredient.findUnique({
      where: { id },
      select: { price: true },
    });

    if (
      price !== undefined &&
      existing &&
      existing.price.toNumber() !== price
    ) {
      await prisma.ingredientPriceHistory.create({
        data: {
          ingredientId: id,
          price: new Prisma.Decimal(price),
        },
      });
    }
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(unit !== undefined && { unit }),
        ...(price !== undefined && { price: new Prisma.Decimal(price) }),
        ...(stock !== undefined && {
          stock: new Prisma.Decimal(stock as number),
        }),
      },
    });
    return NextResponse.json({
      ...ingredient,
      price: ingredient.price.toNumber(),
      stock: ingredient.stock?.toNumber(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el ingrediente" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    await prisma.ingredientPriceHistory.deleteMany({ where: { ingredientId: id } });
    await prisma.ingredient.delete({ where: { id } });
    
    return NextResponse.json({ message: "Ingrediente eliminado" });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "No podés eliminar un insumo que está asociado a una receta" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
