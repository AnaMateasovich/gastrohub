"use client";
import LinkComponent from "./LinkComponent";
import { useUser } from "@/src/contexts/UserContext";
import { MapPin, Pencil, Phone, User, Package, MessageCircle, Focus } from "lucide-react";
import InfoCard from "./InfoCard";
import Link from "next/link";
import UserProfileLetter from "./UserProfileLetter";

const UserProfile = () => {
  const { user, handleLogout } = useUser();

  const name = user?.name;
  const phone = user?.phone ? "+" + user.phone : "Sin especificar";
  const address = user?.address ?? "Sin especificar";

  return (
    <div className="min-h-screen md:min-h-0 flex flex-col">
      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4 py-16 md:py-24">
          <h4 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Iniciar sesión
          </h4>
          <p className="text-gray-500 max-w-[280px]">
            Accedé para ver tus pedidos y guardar tus datos.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[280px] mt-4">
            <LinkComponent href="/login" className="rounded-md py-2 text-lg">
              <p>Iniciar sesión</p>
            </LinkComponent>
            <LinkComponent href="/register" className="rounded-md py-2 text-lg">
              <p>Crear cuenta</p>
            </LinkComponent>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center px-4 py-8 md:py-12 md:max-w-[480px] md:mx-auto w-full">
          <UserProfileLetter />

          <div className="text-center mt-3">
            <p className="text-xl font-bold text-[var(--color-text-primary)]">
              {user.name} {user.lastname ?? ""}
            </p>
            <p className="text-gray-500">{phone}</p>
          </div>

          <div className="mt-4">
            <LinkComponent
              href="/perfil/editar"
              className="rounded-md px-6 py-1.5 text-base"
            >
              <div className="flex items-center gap-2">
                <Pencil size={16} />
                <p>Editar perfil</p>
              </div>
            </LinkComponent>
          </div>

          <div className="mt-8 w-full">
            <InfoCard
              sectionTitle="Información básica"
              items={[
                { icon: User, title: "Nombre", description: `${name} ${user.lastname ?? ""}`.trim() },
                { icon: Phone, title: "Teléfono", description: phone },
                { icon: MapPin, title: "Dirección", description: address },
              ]}
            />
          </div>

          <div className="mt-4 w-full">
            <Link
              href="/perfil"
              className="flex items-center justify-between bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-[var(--color-primary)]" />
                <span className="font-medium text-[var(--color-text-primary)]">
                  Mis pedidos
                </span>
              </div>
              <span className="text-gray-400">›</span>
            </Link>
          </div>

          <div className="flex justify-center text-base text-red-500 font-medium mt-8">
            <button
              onClick={() => {
                handleLogout();
              }}
              className="underline"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Contacto y redes — visible solo en mobile, ya que el footer no se muestra ahí */}
          <div className="md:hidden flex flex-col items-center gap-3 mt-12 pt-8 border-t border-gray-200 w-full">
            <p className="text-sm text-gray-500">¿Necesitás ayuda?</p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/5493413000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--color-primary-dark)] font-medium"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href="https://instagram.com/saboresnaturales"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--color-primary-dark)] font-medium"
              >
                <Focus size={16} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;