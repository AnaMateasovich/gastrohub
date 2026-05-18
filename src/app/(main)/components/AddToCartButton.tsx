'use client'
import { useCart } from "@/src/contexts/CartContext";
import Button from "./Button";
import { useState } from "react";
import { ProductType } from "../../types/product.type";

type Props = {
    product: ProductType
}

const AddToCartButton = ({product}: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addProduct, removeProduct } = useCart();

const handleDecrement = () => {
    if(quantity === 1) return
    setQuantity(quantity - 1)
}

  return (
    <div className="mt-4 flex gap-2">
      <Button text="Agregar al carrito" onClick={() => addProduct(product, quantity)}/>
      <div className="flex items-center gap-2">
        <button onClick={() => handleDecrement()} className="text-lg font-bold py-1 px-3 bg-gray-300 rounded ">-</button>
        <p className="text-lg font-bold py-1 ">{quantity}</p>
        <button onClick={() => setQuantity(quantity + 1)} className="text-lg font-bold py-1 px-3 bg-gray-300 rounded ">+</button>
      </div>
    </div>
  );
};

export default AddToCartButton;
