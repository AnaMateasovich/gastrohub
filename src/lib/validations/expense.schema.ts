import { z } from "zod";

export const expenseSchema = z
  .object({
    type: z.enum(["SUPPLIER", "EMPLOYEE", "FIXED", "OTHER"], {
      error: "Seleccioná un tipo de gasto",
    }),
    amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
    date: z.string().min(1, "La fecha es obligatoria"),
    category: z.string().optional(),
    paymentMethod: z.string().optional(),
    description: z.string().optional(),
    isRecurring: z.boolean().default(false),
    supplierId: z.coerce.number().optional().nullable(),
    employeeId: z.coerce.number().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "SUPPLIER" && !data.supplierId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccioná un proveedor",
        path: ["supplierId"],
      });
    }
    if (data.type === "EMPLOYEE" && !data.employeeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccioná un empleado",
        path: ["employeeId"],
      });
    }
  })
  .transform((data) => ({
    ...data,
    supplierId: data.type === "SUPPLIER" ? data.supplierId : null,
    employeeId: data.type === "EMPLOYEE" ? data.employeeId : null,
  }));

export type ExpenseInput = z.input<typeof expenseSchema>;
export type ExpenseOutput = z.output<typeof expenseSchema>;

export const EXPENSE_TYPE_LABELS: Record<ExpenseOutput["type"], string> = {
  SUPPLIER: "Insumo / Proveedor",
  EMPLOYEE: "Sueldo / Empleado",
  FIXED: "Costo fijo",
  OTHER: "Otro",
};