import BackButton from "@/src/app/(main)/components/BackButton";
import React from "react";
import CreateExpenseForm from "../../../components/forms/CreateExpenseForm";
import { getEmployeeList } from "@/src/lib/employee";
import { getSupplierList } from "@/src/lib/supplier";

const page = async () => {

  const employees = await getEmployeeList()
  const suppliers = await getSupplierList()

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton />
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateExpenseForm suppliers={suppliers} employees={employees} />
    </div>
  );
};

export default page;
