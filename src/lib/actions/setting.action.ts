"use server";
import { storeSettingsSchema } from "../validations/configure.schema";
import { prisma } from "../prisma";
import { StoreSettingsFormType } from "@/src/app/(admin)/components/forms/FormConfigure";
import { requireRole } from "../auth/role";
import { Role } from "@prisma/client";
import { serializeStoreSettings } from "../settings";

export const createStoreSettings = async (data: StoreSettingsFormType) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);
  const parsed = storeSettingsSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const settings = await prisma.storeSettings.create({
    data: {
      organizationId: session.organizationId,
      ...parsed.data,
    },
  });

  return serializeStoreSettings(settings);
};

export const updateStoreSettings = async (data: StoreSettingsFormType) => {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);
  const parsed = storeSettingsSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const settings = await prisma.storeSettings.update({
    where: { organizationId: session.organizationId },
    data: parsed.data,
  });

  return serializeStoreSettings(settings);
};