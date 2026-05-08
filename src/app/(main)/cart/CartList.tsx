"use client";
import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import CartSummary from "../components/CartSummary";
import { useCart } from "@/src/contexts/CartContext";

const CartList = () => {
  const { cart, addProduct, removeProduct, deleteProduct, deliveryFee,wantsDelivery, setWantsDelivery } =
    useCart();
  return (
    <div>
      <div className="flex flex-col gap-2">
        
        {cart?.map((product) => (
          <div key={product.product.id}>
            <ProductCard
              mode="cart"
              product={product.product}
              quantity={product.quantity}
              onAdd={addProduct}
              onRemove={removeProduct}
              onDelete={deleteProduct}
            />
          </div>
        ))}
      </div>
      {cart.length > 0 && (
          <div className="bg-white flex items-center justify-between p-4 text-lg rounded-md shadow-md mt-2">
            <div className="flex gap-2 items-center">
              <p className="font-bold">Envío</p>
              <p>${deliveryFee}</p>
            </div>
            <input type="checkbox" checked={wantsDelivery} onChange={(e) => setWantsDelivery(e.target.checked)} id="" className="mr-2"/>
          </div>
        )}
      <CartSummary />
    </div>
  );
};

export default CartList;
