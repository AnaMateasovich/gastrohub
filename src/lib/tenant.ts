import { headers } from "next/headers";
import "server-only";
import { prisma } from "./prisma";

export async function getCurrentTenant() {
  const host = (await headers()).get("host");

  if (!host) {
    throw new Error("Host no encontrado");
  }

  return getTenantFromHost(host);
}

export async function getTenantFromHost(host:string) {

  const hostname = host.split(":")[0];

  let slug: string | null = null;

  if (hostname.endsWith("lvh.me")) {
    slug = hostname.split(".")[0];
  }

  if (!slug) {
    throw new Error("Tenant no encontrado");
  }

  const tenant = await prisma.organization.findUnique({
    where: {
      slug,
    },
  });

  if (!tenant) {
    throw new Error("Tenant no existe");
  }

  return tenant;
}