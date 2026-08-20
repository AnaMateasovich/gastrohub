"use server";
import { Role } from "@prisma/client";
import { requireRole } from "../auth/role";
import { SupplierInput, supplierSchema } from "../validations/supplier.schema";
import { prisma } from "../prisma";
import { revalidateTag } from "next/cache";

export async function createSupplier(data: SupplierInput) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const parsed = supplierSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const supplier = await prisma.supplier.create({
    data: {
      organizationId: session.organizationId,
      ...parsed.data,
    },
  });
  revalidateTag(`suppliers-${session.organizationId}`, "");

  return supplier;
}

export async function updateSupplier(id: number, data: SupplierInput) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const parsed = supplierSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const supplier = await prisma.supplier.update({
    where: {
      id,
      organizationId: session.organizationId,
    },
    data: parsed.data,
  });
  revalidateTag(`suppliers-${session.organizationId}`, "");

  return supplier;
}

export async function deleteSupplier(id: number) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const supplier = await prisma.supplier.delete({
    where: {
      id,
      organizationId: session.organizationId,
    }
  });
  revalidateTag(`suppliers-${session.organizationId}`, "");

}
