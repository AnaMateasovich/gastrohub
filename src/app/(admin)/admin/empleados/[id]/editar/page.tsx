import CreateEmployeeForm from "@/src/app/(admin)/components/forms/CreateEmployeeForm";
import BackButton from "@/src/app/(main)/components/BackButton";
import { getEmployeeById } from "@/src/lib/employee";
import { getEmployeeRoles } from "@/src/lib/employee-rol.data";
import React from "react";

type Params = Promise<{ id: string }>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const [employee, roles] = await Promise.all([
    getEmployeeById(id),
    getEmployeeRoles(),
  ]);

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton url="/admin/empleados" />
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateEmployeeForm employeeToEdit={employee} roles={roles} />
    </div>
  );
};

export default page;
