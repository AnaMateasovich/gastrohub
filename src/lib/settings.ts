import { StoreSettings } from "@prisma/client";
import { StoreSettingsType } from "../app/types/storeSettings";
import { prisma } from "./prisma";

export async function getSettings(): Promise<StoreSettingsType | null> {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });

  if (!settings) return null;

  return {
    ...settings,
    deliveryFee: Number(settings.deliveryFee),
    freeDeliveryFrom: settings.freeDeliveryFrom ? Number(settings.freeDeliveryFrom) : 0,
    minimumOrderAmount: settings.minimumOrderAmount ? Number(settings.minimumOrderAmount) : 0,
  };
};
