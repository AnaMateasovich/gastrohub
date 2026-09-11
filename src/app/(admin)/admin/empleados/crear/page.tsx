"use server"
import BackButton from "@/src/app/(main)/components/BackButton";
import CreateEmployeeForm from "../../../components/forms/CreateEmployeeForm";
import { EmployeeRole } from "@prisma/client";
import { getEmployeeRoles } from "@/src/lib/employee/employee-rol.data";


const page = async () => {
  
  const employeeRoles:EmployeeRole[] = await getEmployeeRoles()
  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton />
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateEmployeeForm employeeRoles={employeeRoles}/>
    </div>
  );
};

export default page;
