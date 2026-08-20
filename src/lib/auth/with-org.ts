import { Role } from "@prisma/client";
import { requireRole } from "./role";
import { getCurrentTenant } from "../tenant";

export async function withOrg<T, A extends unknown[] = []>(
  roles: Role[],
  fn: (organizationId: string, ...args: A) => Promise<T>,
  ...args: A
): Promise<T> {
  const session = await requireRole(roles);
  return fn(session.organizationId, ...args);
}


export async function withPublicOrg<T, A extends unknown[] = []>(
  fn: (organizationId: string, ...args: A) => Promise<T>,
  ...args: A
): Promise<T> {
  const tenant = await getCurrentTenant();
  return fn(tenant.id, ...args);
}