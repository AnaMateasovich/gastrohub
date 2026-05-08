"use client";
import React, { useState } from "react";
import Button from "./Button";
import { useCart } from "../../../contexts/CartContext";
import { CartItem } from "../../types/cart.type";
import { useUser } from "../../../contexts/UserContext";
import GuessForm from "./GuessForm";
import { useRouter } from "next/navigation";

const CartSummary = () => {
  const [message, setMessage] = useState<string>("");
  const {
    cart,
    clearCart,
    getCartTotal,
    getCartProductsQuantity,
    wantsDelivery,
    deliveryFee,
  } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const handleCheckout = async (cart: CartItem[]) => {
    if (user) {
      try {
        const items = cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        const res = await fetch("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            customerName: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address,
            userId: user.id,
            items,
            deliveryFee: wantsDelivery ? deliveryFee : 0,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          return new Error("Se produjo un error al hacer la compra");
        }
        if (res.ok) {
          clearCart();
          setMessage(
            "✅ Tu pedido fue recibido. Nos pondremos en contacto contigo en breve.",
          );
          setTimeout(() => setMessage(""), 4000);
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      {message && (
        <p className="text-green-600 font-medium text-center px-4">{message}</p>
      )}
      {cart?.length > 0 ? (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 shadow-xl">
          <div className="bg-[var(--color-card)] w-90 gap-4 flex flex-col  rounded-xl py-4 px-8">
            <p className="text-lg">
              Cant. de productos:{" "}
              <span className="font-bold">{getCartProductsQuantity()}</span>
            </p>
            <p className="text-xl text-right">
              Total:{" "}
              <span className="font-bold text-2xl">${getCartTotal()}</span>
            </p>
          </div>
          <div className="mt-2">
            <Button onClick={() => handleCheckout(cart)} text="Comprar" />
          </div>
        </div>
      ) : (
        <p className="pl-1">Tu carrito esta vacío</p>
      )}
    </>
  );
};

export default CartSummary;
