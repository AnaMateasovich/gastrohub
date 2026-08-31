"use client";
import LinkComponent from "./LinkComponent";
import { usePathname } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";
import { useCart } from "@/src/contexts/CartContext";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderProps = {
  logo: string;
  configAlert: React.ReactElement
};
const Header = ({ logo = "GastroHub", configAlert }: HeaderProps) => {
  const path = usePathname();
  const { user, loading } = useUser();
  const { cart, getCartProductsQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const username = user?.name?.split(" ")[0];
  const totalProducts = getCartProductsQuantity();

  const linkClass = (href: string) =>
    path === href
      ? "text-[var(--color-text-primary)] font-medium"
      : "text-[var(--color-primary-dark)]";

  return (
    <header className="bg-[var(--color-background)] border-b border-gray-300 fixed top-0 left-0 w-full z-9999 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      {configAlert}
      <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between px-4 md:px-10 h-[60px] md:h-[70px]">
        <Link
          href="/home"
          className="text-xl font-bold text-[var(--color-primary-dark)]"
        >
          {logo}
        </Link>

        {/* Links de texto, solo en desktop */}
        <div className="hidden md:flex items-center gap-8 text-base">
          <Link href="/home" className={linkClass("/home")}>
            Inicio
          </Link>
          <Link href="/productos" className={linkClass("/productos")}>
            Productos
          </Link>
          <Link
            href="/cart"
            className={`relative flex items-center gap-1 ${linkClass("/cart")}`}
          >
            Carrito
            {mounted && cart.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalProducts > 9 ? "9+" : totalProducts}
              </span>
            )}
          </Link>
        </div>

        {/* Login / usuario, en ambos tamaños */}
        {path !== "/login" && !user && (
          <LinkComponent
            className="px-6 py-1 text-lg rounded-2xl"
            href="/login"
          >
            <p>Ingresar</p>
          </LinkComponent>
        )}

        {user && (
          <Link href="/perfil">
            <div className="flex gap-2 text-[var(--color-primary)] items-center">
              <CircleUser />
              <p className="text-lg font-semibold hidden sm:inline">
                ¡Hola, {username}!
              </p>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
