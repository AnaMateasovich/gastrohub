import CreateSupplierForm from "@/src/app/(admin)/components/forms/CreateSupplierForm";
import BackButton from "@/src/app/(main)/components/BackButton";
import { getSupplierById } from "@/src/lib/supplier";
import React from "react";

type Params = Promise<{ id: string }>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const supplier = await getSupplierById(id);

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton url="/admin/proveedores" />
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateSupplierForm supplierToEdit={supplier} />
    </div>
  );
};

export default page;
