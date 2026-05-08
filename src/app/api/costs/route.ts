import { prisma } from "@/src/lib/prisma";
import { Ingredient, Product, RecipeItem } from "@prisma/client";
import { NextResponse } from "next/server";

type ProductWithRecipe = Product & {
  recipeItems: (RecipeItem & {
    ingredient: Ingredient;
  })[];
};

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        recipeItems: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    const costs = products.map((product: ProductWithRecipe) => {
      const recipeCost = product.recipeItems.reduce((acc, item) => {
        return acc + Number(item.quantity) * Number(item.ingredient.price);
      }, 0);
      const margin = product.price - recipeCost;
      const marginPercent =
        product.price > 0
          ? Number( Math.round((margin / product.price) * 100))
          : 0;

      return {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        recipeCost: Number(recipeCost.toFixed(2)),
        margin: Number(margin.toFixed(2)),
        marginPercent,
        hasRecipe: product.recipeItems.length > 0,
      };
    });
    return NextResponse.json(costs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los costos" },
      { status: 500 },
    );
  }
}
