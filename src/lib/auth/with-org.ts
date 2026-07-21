import { Role } from "@prisma/client";
import { requireRole } from "./role";

export async function withOrg<T, A extends unknown[] = []>(
  roles: Role[],
  fn: (organizationId: string, ...args: A) => Promise<T>,
  ...args: A
): Promise<T> {
  const session = await requireRole(roles);
  return fn(session.organizationId, ...args);
}
