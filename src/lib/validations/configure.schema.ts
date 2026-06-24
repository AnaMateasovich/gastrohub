import z from "zod";

export const storeSettingsSchema = z.object({
  deliveryFee: z.number().min(0, "El costo de envío no puede ser negativo"),
  freeDeliveryFrom: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
  minimumOrderAmount: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
  storeOpen: z.boolean(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  whatsappPhone: z.string().optional(),
  storeEmail: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  instagramUrl: z.string().optional(),
  allowGuestCheckout: z.boolean(),
  enableCoupons: z.boolean(),
  maxDiscountPercentage: z
    .number()
    .int()
    .optional()
    .or(z.nan().transform(() => undefined)),
  announcementBar: z.string().optional(),
  maintenanceMode: z.boolean(),
});
