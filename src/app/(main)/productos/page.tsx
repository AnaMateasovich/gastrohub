import { getProducts } from "@/src/lib/products";
import { ProductType } from "../../types/product.type";
import ProductList from "./ProductList";
import { unstable_cache } from "next/cache";

const getCachedProducts = unstable_cache(
  async () => getProducts(),
  ["products"],
  { tags: ["products"] },
);
const page = async () => {
  const products: ProductType[] = await getCachedProducts();

  return (
    <section className="p-2">
      <h1 className="text-xl font-semibold mb-3 ">Nuestros productos</h1>
      <ProductList products={products} />
    </section>
  );
};

export default page;
