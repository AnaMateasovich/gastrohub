import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/user";
import { NextResponse } from "next/server";
import path from "path";
import z from "zod";
import fs from "fs/promises";
import { requireAdmin } from "@/src/lib/auth";
import { revalidateTag } from "next/cache";
import { ProductImageType } from "@/src/app/types/product.type";

const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  src: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;
    
    const { id: rawId } = await params;
    const id = Number(rawId);


    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const isActive = formData.get("isActive") === "true";
    const image = formData.get("image") as File | null;

    let src: string | undefined = undefined;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name.replace(/\s/g, "")}`;
      const filepath = path.join(process.cwd(), "public", filename);
      await fs.writeFile(filepath, buffer);
      src = `/${filename}`;
    }

    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (oldProduct?.src) {
      await fs
        .unlink(path.join(process.cwd(), "public", oldProduct.src))
        .catch(() => {});
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stock: isNaN(stock) ? 0 : stock,
        isActive,
        ...(src && { src }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating product" },
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
    const id = Number(rawId);

    await prisma.recipeItem.deleteMany({ where: { productId: id } });

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (product?.images?.length) {
      await Promise.all(
        product.images.map((image: ProductImageType) => {
          const filepath = path.join(process.cwd(), "public/products", image.url)
          return fs.unlink(filepath).catch(() => {})
        })
      )
    }

    await prisma.product.delete({ where: { id } });
    revalidateTag("products", "");
    return NextResponse.json({ message: "Producto y receta eliminados" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
