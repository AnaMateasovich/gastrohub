import { Suspense } from "react";
import { getProductBySlug } from "@/src/lib/products";
import { notFound } from "next/navigation";
import BackButton from "@/src/app/(main)/components/BackButton";
import ProductDetails from "@/src/app/(main)/components/ProductDetails";

type Params = Promise<{ slug: string }>;
 
async function ProductDetail({ params }: { params: Params }){
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);

  if (!product) notFound();
  return (
    <div>
      <div className="flex gap-4 items-center mb-2 ml-2">
        <BackButton />
        <h3 className="text-xl font-bold">Productos</h3>
      </div>
     <ProductDetails product={product} mode="admin"/>
    </div>
  );
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetail params={params} />
    </Suspense>
  );
}
