"use client";
import { useCart } from "@/src/contexts/CartContext";
import { Cookie, House, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Nav = () => {
  const pathname = usePathname();
  const { cart, getCartProductsQuantity } = useCart();

  const totalProducts = getCartProductsQuantity()
  return (
    <nav className="bg-[var(--color-background)] border border-gray-400 fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[60]  flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-9999">
      <Link href="home">
        <House
          size={30}
          className={
            pathname === "/home"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
      <Link href="/productos">
        <Cookie
          size={30}
          className={
            pathname === "/productos"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
      <Link href="/cart" className="relative">
        {cart.length > 0 && (
          <span className="absolute -right-2 -top-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {totalProducts > 9 ? "9+" : totalProducts}
          </span>
        )}
        <ShoppingCart
          size={30}
          className={
            pathname === "/cart"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
      <Link href="/perfil">
        <User
          size={30}
          className={
            pathname === "/perfil"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
    </nav>
  );
};

export default Nav;
