import FormCreateProduct from "@/src/app/(admin)/components/FormCreateProduct";
import { prisma } from "@/src/lib/prisma";
import React from "react";

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) return <p>Producto no encontrado</p>;
  return (
    <section className="px-4">
      <FormCreateProduct productToEdit={product} />
    </section>
  );
};

export default EditProductPage;
