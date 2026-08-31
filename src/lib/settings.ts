import { prisma } from "./prisma";
import { getCurrentTenant } from "./tenant/tenant";

export async function getSettings() {
  const tenant = await getCurrentTenant()
  
    const settings = await prisma.storeSettings.findUnique({
      where: { organizationId: tenant.id },
    });

    if (!settings) return null;

    return {
      ...settings,
      deliveryFee: Number(settings.deliveryFee),
      freeDeliveryFrom: settings.freeDeliveryFrom
        ? Number(settings.freeDeliveryFrom)
        : null,
      minimumOrderAmount: settings.minimumOrderAmount
        ? Number(settings.minimumOrderAmount)
        : null,
    };
  
}

export function serializeStoreSettings<T extends Record<string, any>>(settings: T) {
  return {
    ...settings,
    deliveryFee: Number(settings.deliveryFee),
    freeDeliveryFrom: settings.freeDeliveryFrom != null ? Number(settings.freeDeliveryFrom) : null,
    minimumOrderAmount: settings.minimumOrderAmount != null ? Number(settings.minimumOrderAmount) : null,
  };
}