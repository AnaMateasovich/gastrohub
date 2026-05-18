import { getProducts } from "@/src/lib/products";
import { ProductType } from "../../types/product.type";
import ProductList from "./ProductList";

export const metadata = {
  title: "Pan Integral y Waffles de Almendras Artesanales en Casilda, Santa Fe",
  description: "Venta de pan integral, prepizzas de masa madre y waffles de almendras. Productos naturales, sin conservantes y llenos de sabor. ¡Hace tu pedido online!",
  keywords: ["pan integral artesanal", "waffles de almendras", "prepizzas integrales", "comida saludable"],
  openGraph: {
    title: "Productos Saludables y Artesanales - Sabores Naturales",
    description: "Lo mejor en panificación integral y opciones sin harina.",
  },
};
const page = async () => {
  const products: ProductType[] = await getProducts();

  return (
    <section className="p-2">
      <h1 className="text-xl font-semibold mb-3 ">Nuestros productos</h1>
      <ProductList products={products} />
    </section>
  );
};

export default page;
