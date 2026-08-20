import z from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre es demasiado largo"),

  contactName: z
    .string()
    .max(100, "El nombre de contacto es demasiado largo")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .max(30, "El teléfono es demasiado largo")
    .optional()
    .or(z.literal("")),

  email: z.string().email("El email no es válido").optional().or(z.literal("")),

  active: z.boolean().default(true),
});

export type SupplierInput = z.input<typeof supplierSchema>;

export type SupplierOutput = z.output<typeof supplierSchema>;