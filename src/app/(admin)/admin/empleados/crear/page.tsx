import React from "react";
import BackButton from "@/src/app/(main)/components/BackButton";
import CreateEmployeeForm from "../../../components/forms/CreateEmployeeForm";
import { getEmployeeRoles } from "@/src/lib/employee-rol.data";
import { EmployeeRole } from "@prisma/client";


const page = async () => {
  
  const roles:EmployeeRole[] = await getEmployeeRoles()

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton />
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateEmployeeForm roles={roles}/>
    </div>
  );
};

export default page;
