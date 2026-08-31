import z from "zod";

const RESERVED_SLUGS = [
  "www",
  "app",
  "admin",
  "api",
  "auth",
  "login",
  "register",
  "signup",
  "pricing",
  "dashboard",
  "mail",
  "ftp",
  "test",
];

export const registerSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, "El nombre de la empresa debe tener al menos 2 caracteres")
      .max(80, "El nombre de la empresa es demasiado largo"),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "El subdominio debe tener al menos 3 caracteres")
      .max(40, "El subdominio es demasiado largo")
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Solo se permiten letras minúsculas, números y guiones (no al inicio ni al final)",
      )
      .refine((slug) => !RESERVED_SLUGS.includes(slug), {
        message: "Ese subdominio no está disponible",
      }),

    ownerName: z.string().trim().min(2, "Ingresá tu nombre completo"),

    ownerEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email("Ingresá un email válido"),

    ownerPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número"),

    ownerPasswordConfirm: z.string(),

    plan: z.enum(["FREE", "STARTER", "PRO"], {
      error: "El plan es obligatorio",
    }),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Tenés que aceptar los términos y condiciones",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.ownerPassword !== data.ownerPasswordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["ownerPasswordConfirm"],
      });
    }
  });

export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;
