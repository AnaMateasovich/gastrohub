import React from "react";
import CreateSupplierForm from "../../../components/forms/CreateSupplierForm";
import BackButton from "@/src/app/(main)/components/BackButton";

const page = () => {
  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton />
        <h3 className="text-xl font-bold">Crear proveedor</h3>
      </div>
      <CreateSupplierForm />
    </div>
  );
};

export default page;
