import { Suspense } from "react";
import { getProductBySlug } from "@/src/lib/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductImageType } from "@/src/app/types/product.type";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import ProductDetails from "../../components/ProductDetails";

type Params = Promise<{ slug: string }>;

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div>
      <div className="flex gap-4 items-center mb-2 ml-2">
        <BackButton />
        <h3 className="text-xl font-bold">Productos</h3>
      </div>
     <ProductDetails product={product}/>
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
