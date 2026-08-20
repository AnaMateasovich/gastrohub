import { BanknoteArrowDown, ChevronRight, Cog, IdCardLanyard, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminMenu = () => {
  return (
    <section className="">
      <div className="flex text-center justify-center bg-white py-4 rounded-xl shadow-md ">
        <div className="flex flex-col items-center">
          <Image src="/flour.webp" alt="Insumos" width={100} height={100} />
          <h3 className="text-xl font-bold">Insumos</h3>
          <p className="text-sm w-[80%]">Lista de ingredientes y costos</p>
          <Link
            href="/admin/insumos"
            className="bg-gray-300 py-1 px-4 rounded-md mt-2"
          >
            Ver lista
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/recipes.webp" alt="Insumos" width={100} height={100} />
          <h3 className="text-xl font-bold">Recetas</h3>
          <p className="text-sm w-[80%]">Amdinistración de recetas</p>
          <Link
            href="/admin/recetas"
            className="bg-gray-300 py-1 px-4 rounded-md mt-2"
          >
            Gestionar
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-bold text-xl">Más opciones</p>
        <div className="flex flex-col mt-2">
            <Link href="/admin/gastos">
            <div className="flex justify-between bg-white border border-gray-200 py-4 px-3 text-lg rounded-sm shadow-sm">
              <div className="flex gap-2">
                <BanknoteArrowDown />
                <p>Gastos</p>
              </div>
              <ChevronRight className="text-gray-500" />
            </div>
          </Link>
          <Link href="/admin/proveedores">
            <div className="flex justify-between bg-white border border-gray-200 py-4 px-3 text-lg rounded-sm shadow-sm">
              <div className="flex gap-2">
                <Truck />
                <p>Proveedores</p>
              </div>
              <ChevronRight className="text-gray-500" />
            </div>
          </Link>
          <Link href="/admin/empleados">
            <div className="flex justify-between bg-white border border-gray-200 py-4 px-3 text-lg rounded-sm shadow-sm">
              <div className="flex gap-2">
                <IdCardLanyard />

                <p>Empleados</p>
              </div>
              <ChevronRight />
            </div>
          </Link>
          <Link href="/admin/configuracion">
            <div className="flex justify-between bg-white border border-gray-200 py-4 px-3 text-lg rounded-sm shadow-sm">
              <div className="flex gap-2">
                <Cog />
                <p>Configuración</p>
              </div>
              <ChevronRight className="text-gray-500" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminMenu;
