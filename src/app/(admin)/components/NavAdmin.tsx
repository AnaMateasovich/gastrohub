"use client";
import { Cookie, Gauge, Menu, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/admin", icon: Gauge },
  { href: "/admin/pedidos", icon: Package },
  { href: "/admin/productos", icon: Cookie },
  { href: "/admin/menu", icon: Menu },
];

const NavAdmin = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Bottom nav - mobile */}
      <nav
        className="bg-[var(--color-background)] border border-gray-400 fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[60px]
        flex md:hidden items-center justify-around
        shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[9999]"
      >
        {navItems.map(({ href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Icon
              size={30}
              className={
                pathname === href
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-primary-dark)]"
              }
            />
          </Link>
        ))}
      </nav>

      {/* Sidebar - desktop */}
      <nav
        className="bg-[var(--color-background)] border-r border-gray-400 fixed top-0 left-0 h-screen w-[70px]
        hidden md:flex flex-col items-center justify-start gap-8 pt-8
        shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-[9999]"
      >
        {navItems.map(({ href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Icon
              size={30}
              className={
                pathname === href
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-primary-dark)]"
              }
            />
          </Link>
        ))}
      </nav>
    </>
  );
};

export default NavAdmin;