import z from "zod";

export const storeSettingsSchema = z.object({
  organizationName: z.string().max(20).optional().or(z.literal("")),
  heroImageUrl: z.string().max(500).optional().or(z.literal("")),
  heroBadgeText: z.string().max(100).optional().or(z.literal("")),
  heroTitle: z.string().max(150).optional().or(z.literal("")),
  heroHighlight: z.string().max(150).optional().or(z.literal("")),
  heroSubtitle: z.string().max(255).optional().or(z.literal("")),
  ctaLabel: z.string().max(50).optional().or(z.literal("")),
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
  storeEmail: z.string().email("Email inválido").optional().or(z.literal("")),
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
