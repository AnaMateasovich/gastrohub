"use client";
import LinkComponent from "./LinkComponent";
import { useUser } from "@/src/contexts/UserContext";
import { MapPin, Pencil, Phone, User } from "lucide-react";
import InfoCard from "./InfoCard";
import Link from "next/link";
import UserProfileLetter from "./UserProfileLetter";

const UserProfile = () => {
  const { user, handleLogout } = useUser();

  const name = user?.name;
  const phone = "+" + user?.phone;
  const address = user?.address;
  return (
    <div className="relative h-screen">
      {!user ? (
        <div className="absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 text-center w-full">
          <h4 className="text-2xl font-bold">Iniciar sesión</h4>
          <p className="">Accedé para ver tus pedidos y guardar tus datos.</p>
          <div className="flex flex-col gap-3 w-60 mt-2">
            <LinkComponent href="/login" className="rounded-md py-1 text-lg">
              <p>Iniciar sesión</p>
            </LinkComponent>
            <LinkComponent href="/register" className="rounded-md py-1 text-lg">
              <p>Crear cuenta</p>
            </LinkComponent>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3">
            <UserProfileLetter />
            <div>
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-xl">+{user.phone}</p>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <LinkComponent
              href="/perfil/editar"
              className=" rounded-md px-6 py-1 text-lg"
            >
              <div className="flex items-center gap-3">
                <Pencil size={17} />
                <p>Editar perfil</p>
              </div>
            </LinkComponent>
          </div>
          <div className="mt-6">
            <InfoCard
              sectionTitle="Infomación básica"
              items={[
                { icon: User, title: "Nombre", description: name! },
                { icon: Phone, title: "Teléfono", description: phone! },
                { icon: MapPin, title: "Dirección", description: address! },
              ]}
            />
          </div>
          <div className="flex justify-center text-lg text-red-500 font-bold mt-8 ">
            <Link href="/home">
              <button onClick={handleLogout} className="underline">
                Cerrar sesión
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
