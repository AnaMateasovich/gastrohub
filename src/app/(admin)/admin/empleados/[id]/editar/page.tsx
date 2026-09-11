import CreateEmployeeForm from "@/src/app/(admin)/components/forms/CreateEmployeeForm";
import BackButton from "@/src/app/(main)/components/BackButton";
import { getEmployeeByIdWithUser } from "@/src/lib/employee/employee";
import { getEmployeeRoles } from "@/src/lib/employee/employee-rol.data";

type Params = Promise<{ id: string }>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const [employee, employeeRoles] = await Promise.all([
    getEmployeeByIdWithUser(id),
    getEmployeeRoles(),
  ]);

  if (!employee) {
    return null;
  }

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton url="/admin/empleados" />
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateEmployeeForm
        employeeToEdit={employee}
        employeeRoles={employeeRoles}
      />
    </div>
  );
};

export default page;
