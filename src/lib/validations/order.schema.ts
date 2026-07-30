import z from "zod";

export const orderItemsSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export const baseOrderSchema = z.object({
  customerName: z.string().min(1, "El nombre es requerido"),
  customerLastname: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "El teléfono debe tener al menos 6 caracteres"),
  address: z.string().min(3, "La dirección debe tener al menos 3 caracteres"),
  orderItems: z.array(orderItemsSchema).min(1),
  wantsDelivery: z.boolean(),
  discount: z.number().min(0).max(100).optional(),
  customerId: z.string().optional().nullable(),
});

export const createOrderSchema = baseOrderSchema.extend({
  customerName: z.string().min(1),
  customerLastname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(3),
});

export const adminCreateOrderSchema = baseOrderSchema
  .extend({
    customerType: z.enum(["new", "existing", "anonymous"]),
  })
  .superRefine((data, ctx) => {
    if (data.customerType === "existing" && !data.customerId) {
      ctx.addIssue({
        code: "custom",
        message: "Falta seleccionar un cliente existente.",
        path: ["customerId"],
      });
    }

    if (data.customerType === "new") {
      if (!data.customerName) {
        ctx.addIssue({
          code: "custom",
          message: "El nombre es requerido para un cliente nuevo.",
          path: ["customerName"],
        });
      }
      if (!data.customerLastname) {
        ctx.addIssue({
          code: "custom",
          message: "El apellido es requerido para un cliente nuevo.",
          path: ["customerLastname"],
        });
      }
      if (!data.email) {
        ctx.addIssue({
          code: "custom",
          message: "El email es requerido para un cliente nuevo.",
          path: ["email"],
        });
      }
    }

    if (data.wantsDelivery && !data.address) {
      ctx.addIssue({
        code: "custom",
        message: "La dirección es requerida si el pedido tiene delivery.",
        path: ["address"],
      });
    }
  });
