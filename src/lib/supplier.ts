"use server";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { withOrg } from "./auth/with-org";
import { Role } from "@prisma/client";
import { requireRole } from "./auth/role";

export async function getSupplierListCached(organizationId: string) {
  "use cache";
  cacheTag(`suppliers-${organizationId}`);
  cacheLife("max");

  return prisma.supplier.findMany({
    where: { organizationId },
  });
}

export async function getSupplierList() {
  return withOrg([Role.OWNER, Role.ADMIN, Role.STAFF], getSupplierListCached);
}

export async function getSupplierById(id: string) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const supplier = await prisma.supplier.findFirst({
    where: {
      id: Number(id),
      organizationId: session.organizationId,
    },
  });

  return supplier;
}
