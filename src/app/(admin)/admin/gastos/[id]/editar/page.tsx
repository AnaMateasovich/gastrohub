import CreateExpenseForm from "@/src/app/(admin)/components/forms/CreateExpenseForm";
import BackButton from "@/src/app/(main)/components/BackButton";
import { getEmployeeList } from "@/src/lib/employee";
import { getExpenseById } from "@/src/lib/expense";
import { getSupplierList } from "@/src/lib/supplier";

type Params = Promise<{ id: string }>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const [expense, suppliers, employees] = await Promise.all([
    getExpenseById(id),
    getSupplierList(),
    getEmployeeList(),
  ]);

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton url="/admin/gastos"/>
        <h3 className="text-xl font-bold">Crear empleado</h3>
      </div>
      <CreateExpenseForm
        expenseToEdit={expense}
        suppliers={suppliers}
        employees={employees}
      />
    </div>
  );
};

export default page;
