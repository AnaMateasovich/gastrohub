"use client";
import { Cookie, Gauge, House, Menu, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavAdmin = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-[var(--color-background)] border border-gray-400 fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[60]  flex items-center justify-around
     shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-9999">
      <Link href="/admin">
        <Gauge
          size={30}
          className={
            pathname === "/admin"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
      <Link href="/admin/pedidos">
        <Package
          size={30}
          className={
            pathname === "/admin/pedidos"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
      <Link href="/admin/productos">
        <Cookie
          size={30}
          className={
            pathname === "/admin/productos"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
      <Link href="/admin/menu">
        <Menu
          size={30}
          className={
            pathname === "/admin/menu"
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-primary-dark)]"
          }
        />
      </Link>
    </nav>
  );
};

export default NavAdmin;
