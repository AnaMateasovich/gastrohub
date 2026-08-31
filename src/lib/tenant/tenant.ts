import { headers } from "next/headers";
import "server-only";
import { prisma } from "../prisma";
import { extractSlug } from "./extract-slug";


export async function getCurrentTenant() {
  const host = (await headers()).get("host");

  if (!host) {
    throw new Error("Host no encontrado");
  }

  return getTenantFromHost(host);
}

export async function getTenantFromHost(host: string) {
  const hostname = host.split(":")[0];

  const slug = extractSlug(hostname);

  if (!slug) {
    return null;
  }

  const tenant = await prisma.organization.findUnique({
    where: { slug },
  });

  if (!tenant) {
    throw new Error("Tenant no existe");
  }

  return tenant;
}

