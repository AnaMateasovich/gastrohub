import { Role } from "@prisma/client";
import { StoreSettingsType } from "../app/types/storeSettings";
import { requireRole } from "./auth/role";
import { prisma } from "./prisma";
import { getCurrentTenant } from "./tenant";

export async function getSettings(): Promise<StoreSettingsType | null> {
const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const settings = await prisma.storeSettings.findUnique({ where: {organizationId: session.organizationId} });

  if (!settings) return null;

  return {
    ...settings,
    deliveryFee: Number(settings.deliveryFee),
    freeDeliveryFrom: settings.freeDeliveryFrom
      ? Number(settings.freeDeliveryFrom)
      : 0,
    minimumOrderAmount: settings.minimumOrderAmount
      ? Number(settings.minimumOrderAmount)
      : 0,
  };
}
