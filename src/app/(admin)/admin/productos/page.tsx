import Link from "next/link";
import ProductListAdmin from "./ProductListAdmin";
import { ProductType } from "@/src/app/types/product.type";
import { getProducts } from "@/src/lib/products";

const page = async () => {

    const products: ProductType[] = await getProducts();
  
  return (
    <section className="px-2 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-2xl font-semibold">Productos</h4>
        <Link
          href="/admin/productos/crear"
          className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm"
        >
          Crear nuevo +
        </Link>
      </div>

      <ProductListAdmin products={products}/>
    </section>
  );
};

export default page;
