"use server";
import Button from "./Button";
import { ProductImageType, ProductType } from "../../types/product.type";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

type Props = {
  product: ProductType;
};
const ProductDetails = async ({ product }: Props) => {
  return (
    <>
      <div className="relative self-stretch w-full h-[400px] overflow-hidden flex-shrink-0">
        {product.images.map((image: ProductImageType) => (
          <Image
            priority
            key={image.id}
            src={image.url}
            alt={product.name}
            sizes="500px"
            fill
            className="object-cover"
          />
        ))}
      </div>
      <div className="m-4">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p>{product.description}</p>
        <div className="flex gap-4 mt-4">
          <div className="border border-gray-300 px-4 py-2 rounded-xl min-w-[120px]">
            <p>Peso</p>
            <p className="font-bold text-xl text-right">900 g</p>
          </div>
          <div className="border border-gray-300 px-4 py-2 rounded-xl min-w-[120px]">
            <p>Precio</p>
            <p className="font-bold text-xl text-right">${product.price}</p>
          </div>
        </div>
        <AddToCartButton product={product}/>
      </div>
    </>
  );
};

export default ProductDetails;
