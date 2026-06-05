"use client";
import React, { useState } from "react";
import Button from "./Button";
import { useCart } from "../../../contexts/CartContext";
import { CartItem } from "../../types/cart.type";
import { useUser } from "../../../contexts/UserContext";
import { useRouter } from "next/navigation";
import { createOrder } from "@/src/lib/actions/orders.action";

const CartSummary = () => {
  const [message, setMessage] = useState<string>("");
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const {
    cart,
    clearCart,
    getCartTotal,
    getCartProductsQuantity,
    wantsDelivery,
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
        await createOrder({
          customerName: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          userId: user.id,
          orderItems: items,
          wantsDelivery,
        });
        clearCart();
        setMessage(
          "✅ Tu pedido fue recibido. Nos pondremos en contacto contigo en breve.",
        );
        setTimeout(() => setMessage(""), 4000);
      } catch (error) {
        console.error(error);
      }
      return;
    }
    setShowGuestModal(true);
  };

  return (
    <>
      {showGuestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-[var(--color-card)] rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">
              ¿Cómo querés continuar?
            </h2>
            <p className="text-sm text-center text-gray-500">
              Podés registrarte para guardar tu historial de pedidos o continuar
              como invitado.
            </p>
            <Button
              text="Crear una cuenta"
              onClick={() => router.push("/register")}
            />
            <button
              onClick={() => {
                setShowGuestModal(false);
                router.push("/checkout");
              }}
              className="text-sm text-gray-700 hover:text-gray-600 underline text-center transition-colors"
            >
              Continuar como invitado
            </button>
            <button
              onClick={() => setShowGuestModal(false)}
              className="text-xs text-gray-600 hover:text-gray-500 text-center transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
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
