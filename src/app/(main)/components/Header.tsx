"use client";
import LinkComponent from "./LinkComponent";
import { usePathname } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";
import { CircleUser } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const path = usePathname();
  const { user, loading } = useUser();

  const username = user?.name?.split(" ")[0];

  
  return (
    <header className="p-2 flex justify-between items-center">
      <h2 className="text-2xl font-[Open_Sans] italic">Sabores Naturales </h2>
      {path !== "/login" && !user && (
        <div>
          <LinkComponent
            className="px-6 py-1 text-lg rounded-2xl"
            href="/login"
          >
            <p>Ingresar</p>
          </LinkComponent>
        </div>
      )}
      {user && (
        <Link href="/perfil">
          <div className="flex gap-2 text-[var(--color-primary)] items-center">
            <CircleUser />
            <p className="text-lg font-semibold ">¡Hola, {username}!</p>
          </div>
        </Link>
      )}
    </header>
  );
};

export default Header;
