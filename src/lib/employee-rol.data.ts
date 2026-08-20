import { prisma } from "@/src/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";
import { withOrg } from "./auth/with-org";

async function getEmployeeRolesCached(organizationId: string) {
  "use cache";
  cacheTag(`employee-roles-${organizationId}`);
  cacheLife("hours");

  return prisma.employeeRole.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  });
}

export async function getEmployeeRoles() {
  return await withOrg(["OWNER", "ADMIN", "STAFF"], getEmployeeRolesCached);
}