export type StoreSettingsType = {
  organizationId: string;

  // Información de la tienda
  organizationName: string | null;
  storeDescription: string | null;

  // Ubicación
  city: string | null;
  province: string | null;
  address: string | null;

  // Landing / Hero
  heroImageUrl: string | null;
  heroBadgeText: string | null;
  heroTitle: string | null;
  heroHighlight: string | null;
  heroSubtitle: string | null;
  ctaLabel: string | null;

  // Envíos
  deliveryFee: number;
  freeDeliveryFrom: number | null;
  minimumOrderAmount: number | null;

  // Horarios
  storeOpen: boolean;
  openingTime: string | null;
  closingTime: string | null;

  // Contacto
  whatsappPhone: string | null;
  storeEmail: string | null;
  instagramUrl: string | null;

  // Pedidos
  allowGuestCheckout: boolean;

  // Cupones
  enableCoupons: boolean;
  maxDiscountPercentage: number | null;

  // Anuncios
  announcementBar: string | null;

  // Sistema
  maintenanceMode: boolean;

  updatedAt: Date;
};

export type StoreSettingsInput = Omit<
  StoreSettingsType,
  "organizationId" | "updatedAt"
>;