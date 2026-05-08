import { ChevronRight, Cog, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminMenu = () => {
  return (
    <section className="">
      <div className="flex text-center justify-center bg-white py-4 rounded-xl shadow-md ">
        <div className="flex flex-col items-center">
          <Image src="/flour.png" alt="Insumos" width={100} height={100} />
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
          <Image src="/recipes.png" alt="Insumos" width={100} height={100} />
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
          <div className="flex justify-between bg-white border border-gray-200 py-4 px-3 text-lg rounded-sm shadow-sm">
            <div className="flex gap-2">
              <Truck />
              <Link href="/admin/costs">Proveedores</Link>
            </div>
            <ChevronRight className="text-gray-500"/>
          </div>
           <div className="flex justify-between bg-white border border-gray-300 py-4 px-3 text-lg rounded-sm shadow-sm">
            <div className="flex gap-2">
              <Cog />
              <Link href="/admin/costs">Configuración</Link>
            </div>
            <ChevronRight className="text-gray-500"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminMenu;
