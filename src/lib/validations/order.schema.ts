import z from "zod";

export const orderItemsSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export const baseOrderSchema = z.object({
  customerName: z.string().min(1),
  customerLastname: z.string().min(1),
  email: z.string(),
  phone: z.string().min(6),
  address: z.string().min(3),
  orderItems: z.array(orderItemsSchema).min(1),
  wantsDelivery: z.boolean(),
  discount: z.number().min(0).max(100).optional(),
  userId: z.string().optional().nullable(),
});

export const createOrderSchema = baseOrderSchema;

export const adminCreateOrderSchema = baseOrderSchema.extend({
  customerType: z.enum(["new", "existing", "anonymous"]),
});