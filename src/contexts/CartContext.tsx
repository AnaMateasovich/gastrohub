"use client";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { CartItem } from "../app/types/cart.type";
import { ProductType } from "../app/types/product.type";

type CartContextType = {
  cart: CartItem[];
  addProduct: (product: ProductType, quantity: number) => void;
  removeProduct: (id: number) => void;
  deleteProduct: (id: number) => void;
  getCartTotal: () => number;
  getCartProductsQuantity: () => number;
  clearCart: () => void;
  deliveryFee: number
  wantsDelivery: boolean
  setWantsDelivery: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartContext = createContext<CartContextType | null>(null);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
const [wantsDelivery, setWantsDelivery] = useState(false);


  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) {
          throw new Error("Error al obtener el precio del envío");
        }
        const data = await res.json();
        setDeliveryFee(Number(data.deliveryFee));
      } catch (error) {
        console.error(error);
      }
    };
    fetchDeliveryFee();
  }, []);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: ProductType, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { product, quantity}];
    });
  };

  const removeProduct = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === id);

      if (!existing) return prev;

      if (existing.quantity === 1) {
        return prev;
      }

      return prev.map((item) =>
        item.product.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const deleteProduct = (id: number) => {
    setCart((prev) => {
      return prev.filter((item) => item.product.id !== id);
    });
  };

 const getCartTotal = () => {
  const subtotal = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return wantsDelivery ? subtotal + deliveryFee : subtotal;
};

  const getCartProductsQuantity = () => {
    return cart.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        removeProduct,
        getCartTotal,
        getCartProductsQuantity,
        deleteProduct,
        clearCart,
        deliveryFee,
        wantsDelivery,
        setWantsDelivery
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
