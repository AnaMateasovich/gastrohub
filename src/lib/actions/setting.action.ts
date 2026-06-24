"use server";
import { storeSettingsSchema } from "../validations/configure.schema";
import { prisma } from "../prisma";
import { StoreSettingsFormType } from "@/src/app/(admin)/components/FormConfigure";

export const createStoreSettings = async (data: StoreSettingsFormType) => {
  const parsed = storeSettingsSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const settings = await prisma.storeSettings.create({
    data: {
      deliveryFee: parsed.data.deliveryFee,
      freeDeliveryFrom: parsed.data.freeDeliveryFrom,
      minimumOrderAmount: parsed.data.minimumOrderAmount,
      storeOpen: parsed.data.storeOpen,
      openingTime: parsed.data.openingTime,
      closingTime: parsed.data.closingTime,
      whatsappPhone: parsed.data.whatsappPhone,
      storeEmail: parsed.data.storeEmail,
      instagramUrl: parsed.data.instagramUrl,
      allowGuestCheckout: parsed.data.allowGuestCheckout,
      enableCoupons: parsed.data.enableCoupons,
      maxDiscountPercentage: parsed.data.maxDiscountPercentage,
      announcementBar: parsed.data.announcementBar,
      maintenanceMode: parsed.data.maintenanceMode,
    },
  });

  return settings;
};

export const updateStoreSettings = async (data: StoreSettingsFormType) => {
  const parsed = storeSettingsSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const settings = await prisma.storeSettings.update({
    where: { id: 1 },
    data: {
      deliveryFee: parsed.data.deliveryFee,
      freeDeliveryFrom: parsed.data.freeDeliveryFrom,
      minimumOrderAmount: parsed.data.minimumOrderAmount,
      storeOpen: parsed.data.storeOpen,
      openingTime: parsed.data.openingTime,
      closingTime: parsed.data.closingTime,
      whatsappPhone: parsed.data.whatsappPhone,
      storeEmail: parsed.data.storeEmail,
      instagramUrl: parsed.data.instagramUrl,
      allowGuestCheckout: parsed.data.allowGuestCheckout,
      enableCoupons: parsed.data.enableCoupons,
      maxDiscountPercentage: parsed.data.maxDiscountPercentage,
      announcementBar: parsed.data.announcementBar,
      maintenanceMode: parsed.data.maintenanceMode,
    },
  });

  return settings;
};