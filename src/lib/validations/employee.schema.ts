import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre es demasiado largo"),

  roleId: z.string().min(1, "Seleccioná un puesto"),

  phone: z
    .string()
    .max(30, "El teléfono es demasiado largo")
    .optional()
    .or(z.literal("")),
  baseSalary: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = typeof val === "string" ? Number(val) : val;
      return Number.isNaN(num) ? undefined : num;
    }),
  active: z.boolean().default(true),
});

export type EmployeeInput = z.input<typeof employeeSchema>;
export type EmployeeOutput = z.output<typeof employeeSchema>;
