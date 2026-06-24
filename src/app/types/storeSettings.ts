export type StoreSettingsType = {
  id: number;
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