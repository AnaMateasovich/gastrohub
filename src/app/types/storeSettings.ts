export type StoreSettingsType = {
  id: number;
  organizationName: string | null;
  heroImageUrl: string | null;
  heroBadgeText: string | null;
  heroTitle: string | null;
  heroHighlight: string | null;
  heroSubtitle: string | null;
  ctaLabel: string | null;
  deliveryFee: number;
  freeDeliveryFrom?: number;
  minimumOrderAmount?: number;
  storeOpen: boolean;
  openingTime?: string;
  closingTime?: string;
  whatsappPhone?: string;
  storeEmail?: string;
  instagramUrl?: string;
  allowGuestCheckout?: boolean;
  enableCoupons: boolean;
  maxDiscountPercentage?: number;
  announcementBar: string;
  maintenanceMode: boolean;
  updatedAt: Date;
};

export type StoreSettingsInput = Omit<StoreSettingsType, "id" | "updatedAt">;
