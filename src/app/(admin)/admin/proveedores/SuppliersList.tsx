"use client";
import { Supplier } from "@prisma/client";
import React from "react";
import AdminListCard from "../../components/AdminListCard";
import { useRouter } from "next/navigation";
import BackButton from "@/src/app/(main)/components/BackButton";
import Link from "next/link";
import { deleteSupplier } from "@/src/lib/actions/supplier.action";
import { toast } from "sonner";
import { refresh } from "next/cache";

type Props = {
  suppliers: Supplier[];
};
const SuppliersList = ({ suppliers }: Props) => {
  const handleDelete = (id: number, name: string) => {
    const confirm = window.confirm(
      "Estas seguro que quieres eliminar el proveedor " + name,
    );
    if (!confirm) return;
    try {
      deleteSupplier(id);
      toast.success("Proveedor eliminado");
      refresh()
    } catch {
      toast.error("Ocurrio un error al eliminar el proveedor");
    }
  };

  const router = useRouter();
  return (
    <div className="">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <BackButton url="/admin/menu" />
          <h1 className="text-xl font-bold">Proveedores</h1>
        </div>
        <Link
          href="/admin/proveedores/crear"
          className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm"
        >
          Crear nuevo +
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <AdminListCard
            key={s.id}
            item={s}
            testId="supplier"
            title={(s) => s.name}
            badge={(s) => s.email}
            fields={[
              { key: "contactName", label: "Nombre de contacto" },
              {
                key: "phone",
                label: "Teléfono",
              },
            ]}
            onEdit={(s) => router.push(`/admin/proveedores/${s.id}/editar`)}
            onDelete={(s) => handleDelete(s.id, s.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuppliersList;
