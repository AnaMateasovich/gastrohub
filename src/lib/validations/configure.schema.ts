import z from "zod";

export const storeSettingsSchema = z.object({
  // Información de la tienda
  organizationName: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),

  storeDescription: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),

  // Ubicación
  city: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),

  province: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(255)
    .optional()
    .or(z.literal("")),

  // Landing / Hero
  heroImageUrl: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),

  heroBadgeText: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),

  heroTitle: z
    .string()
    .max(150)
    .optional()
    .or(z.literal("")),

  heroHighlight: z
    .string()
    .max(150)
    .optional()
    .or(z.literal("")),

  heroSubtitle: z
    .string()
    .max(255)
    .optional()
    .or(z.literal("")),

  ctaLabel: z
    .string()
    .max(50)
    .optional()
    .or(z.literal("")),

  // Envíos
  deliveryFee: z
    .number()
    .min(0, "El costo de envío no puede ser negativo"),

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

  // Horarios
  storeOpen: z.boolean(),

  openingTime: z.string().optional(),

  closingTime: z.string().optional(),

  // Contacto
  whatsappPhone: z.string().optional(),

  storeEmail: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),

  instagramUrl: z.string().optional(),

  // Pedidos
  allowGuestCheckout: z.boolean(),

  enableCoupons: z.boolean(),

  maxDiscountPercentage: z
    .number()
    .int()
    .optional()
    .or(z.nan().transform(() => undefined)),

  // Anuncios
  announcementBar: z.string().optional(),

  // Sistema
  maintenanceMode: z.boolean(),
});