import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/user";
import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import fs from "fs/promises";

const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  stock: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
  isActive: z.boolean().default(true),

  src: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await getUser();
    console.log("user", user);
    console.log(user, user.role);
    if (!user || user.role !== "ADMIN") {
      return new Response("No autorizado", { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const isActive = formData.get("isActive") === "true";
    const stock = Number(formData.get("stock"));
    const image = formData.get("image") as File | null;

    let src: string | null = null;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
      const filepath = path.join(process.cwd(), "public", filename);
      await fs.writeFile(filepath, buffer);
      src = `/${filename}`;
    }

    const result = ProductSchema.safeParse({ name, price, stock, src });
    if (!result.success) {
      console.log("Zod error:", result.error.format()); // 👈
      return new Response("Datos invalidos", { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, price, stock: isNaN(stock) ? 0 : stock, src },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json("Error getting products");
  }
}
