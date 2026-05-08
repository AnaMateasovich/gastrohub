import Link from "next/link";
import Hero from "../components/Hero";
import PopularProductsCard from "../components/PopularProductsCard";
import { getProducts } from "@/src/lib/products";
import { ProductType } from "../../types/product.type";

const Page = async () => {
  const products:ProductType[] = await getProducts();

  return (
    <section className="mb-4">
      <Hero />
      <div className="px-2 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Productos destacados</h2>
          <Link href="/productos" className="text-lg underline font-bold">Ver todos</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {products.map((product) => (
            <PopularProductsCard
              key={product.id}
              imageSrc={product.src}
              name={product.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;