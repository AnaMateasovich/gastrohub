import Link from "next/link";
import ProductListAdmin from "./ProductListAdmin";
import { ProductWithRecipeAndCostsType } from "@/src/app/types/product.type";
import { getProductsAdmin } from "@/src/lib/products";
import { headers } from "next/headers";

const page = async () => {
  const products: ProductWithRecipeAndCostsType[] = await getProductsAdmin();

  return (
    <section className=" flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-2xl font-semibold">Productos</h4>
        <Link
          href="/admin/productos/crear"
          className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm"
        >
          Crear nuevo +
        </Link>
      </div>

      <ProductListAdmin products={products} />
    </section>
  );
};

export default page;
