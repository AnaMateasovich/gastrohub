import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { withOrg } from "./auth/with-org";
import { Employee, Prisma, Role } from "@prisma/client";
import { requireRole } from "./auth/role";

export type EmployeeWithRole = Prisma.EmployeeGetPayload<{
  include: { role: true };
}>;

export async function getEmployeeListCached(organizationId: string) {
  "use cache";
  cacheTag(`employee-${organizationId}`);
  cacheLife("max");

  const employees = await prisma.employee.findMany({
    where: { organizationId },
    orderBy: {
      name: "asc",
    },
    include: { role: true },
  });

  return employees.map((employee: Employee) => ({
    ...employee,
    roleId: Number(employee.roleId),
    baseSalary:
      employee.baseSalary !== null ? Number(employee.baseSalary) : null,
  }));
}

export async function getEmployeeList() {
  return withOrg([Role.OWNER, Role.ADMIN], getEmployeeListCached);
}

export async function getEmployeeById(id: string) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const employee = await prisma.employee.findFirst({
    where: {
      id: Number(id),
      organizationId: session.organizationId,
    },
    include: { role: true },
  });

  return {
    ...employee,
    baseSalary:
      employee.baseSalary !== null ? Number(employee.baseSalary) : null,
  };
}
