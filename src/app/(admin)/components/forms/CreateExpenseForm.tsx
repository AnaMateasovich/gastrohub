"use client";
import Button from "@/src/app/(main)/components/Button";
import Input from "@/src/app/(main)/components/Input";
import { createExpense, updateExpense } from "@/src/lib/actions/expenses.action";
//import { createExpense } from "@/src/lib/actions/expense.action";
import {
  EXPENSE_TYPE_LABELS,
  ExpenseInput,
  ExpenseOutput,
  expenseSchema,
} from "@/src/lib/validations/expense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee, Expense, Supplier } from "@prisma/client";
import { refresh } from "next/cache";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  expenseToEdit?: Expense;
  suppliers: Supplier[];
  employees: Employee[];
};

const selectClass =
  "border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-[var(--color-text-primary)] bg-[var(--color-surface)] w-full";

const CreateExpenseForm = ({ expenseToEdit, suppliers, employees }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseInput, unknown, ExpenseOutput>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: expenseToEdit
      ? {
          type: expenseToEdit.type,
          amount: Number(expenseToEdit.amount),
          date: expenseToEdit.date.toISOString().slice(0, 10),
          category: expenseToEdit.category ?? "",
          paymentMethod: expenseToEdit.paymentMethod ?? "",
          description: expenseToEdit.description ?? "",
          isRecurring: expenseToEdit.isRecurring,
          supplierId: expenseToEdit.supplierId ?? undefined,
          employeeId: expenseToEdit.employeeId ?? undefined,
        }
      : {
          type: "SUPPLIER",
          amount: 0,
          date: new Date().toISOString().slice(0, 10),
          category: "",
          paymentMethod: "",
          description: "",
          isRecurring: false,
          supplierId: undefined,
          employeeId: undefined,
        },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: ExpenseOutput) => {
    try {
      if (expenseToEdit) {
        await updateExpense(expenseToEdit.id, data)
        toast.success("Gasto actualizado");
      } else {
        await createExpense(data);
        toast.success("Gasto creado");
      }
      router.refresh();
      router.push("/admin/gastos");
      reset()
    } catch (error) {
      toast.error("Ocurrio un error al guardar el gasto");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
         <Input
          type="text"
          name="category"
          register={register}
          placeholder="Título / categoría"
          error={errors.paymentMethod?.message}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--color-text-secondary)]">
            Tipo de gasto
          </label>
          <select {...register("type")} className={selectClass}>
            {Object.entries(EXPENSE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.type && (
            <span className="text-xs text-[var(--color-error)]">
              {errors.type.message}
            </span>
          )}
        </div>

        {selectedType === "SUPPLIER" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--color-text-secondary)]">
              Proveedor
            </label>
            <select {...register("supplierId")} className={selectClass}>
              <option value="">Seleccioná un proveedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <span className="text-xs text-[var(--color-error)]">
                {errors.supplierId.message}
              </span>
            )}
          </div>
        )}

        {selectedType === "EMPLOYEE" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--color-text-secondary)]">
              Empleado
            </label>
            <select {...register("employeeId")} className={selectClass}>
              <option value="">Seleccioná un empleado</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <span className="text-xs text-[var(--color-error)]">
                {errors.employeeId.message}
              </span>
            )}
          </div>
        )}

        {(selectedType === "FIXED" || selectedType === "OTHER") && (
          <Input
            type="text"
            name="category"
            register={register}
            placeholder="Categoría (ej: alquiler, luz)"
            error={errors.category?.message}
          />
        )}

        <Input
          type="number"
          name="amount"
          register={register}
          placeholder="Monto"
          error={errors.amount?.message}
        />

        <Input
          type="date"
          name="date"
          register={register}
          placeholder="Fecha"
          error={errors.date?.message}
        />

        <Input
          type="text"
          name="paymentMethod"
          register={register}
          placeholder="Método de pago (efectivo, transferencia...)"
          error={errors.paymentMethod?.message}
        />

        <Input
          type="text"
          name="description"
          register={register}
          placeholder="Descripción (opcional)"
          error={errors.description?.message}
        />

        <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] mt-1">
          <input type="checkbox" {...register("isRecurring")} />
          Es un gasto recurrente (se repite todos los meses)
        </label>

        <Button
          type="submit"
          disabled={isSubmitting}
          text={
            isSubmitting ? "Guardando" : expenseToEdit ? "Actualizar" : "Crear"
          }
          className="mt-2"
        />
      </form>
    </div>
  );
};

export default CreateExpenseForm;