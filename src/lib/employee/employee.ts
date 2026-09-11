import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "../prisma";
import { withOrg } from "../auth/with-org";
import { Employee, Prisma, Role } from "@prisma/client";
import { requireRole } from "../auth/role";

export type FilterStatusEmployee = "CURRENT" | "FORMER" | "ALL";

export type EmployeeWithAccessStatus = Prisma.EmployeeGetPayload<{
  include: {
    employeeRole: true;
    user: {
      include: {
        memberships: {
          select: {
            status: true;
          };
        };
      };
    };
    invitations: true;
  };
}> & {
  access: "ACTIVE" | "PENDING" | "NONE";
};

export type EmployeeWithUser = NonNullable<
  Awaited<ReturnType<typeof getEmployeeByIdWithUser>>
>;

export async function getEmployeeListCached(
  organizationId: string,
  status: string,
) {
  "use cache";
  cacheTag(`employee-${organizationId}`);
  cacheLife("max");

  const employees = await prisma.employee.findMany({
    where: {
      organizationId,
      ...(status !== "ALL" && {
        active: status === "CURRENT",
      }),
    },
    orderBy: {
      name: "asc",
    },
    include: {
      employeeRole: true,
      user: {
        include: {
          memberships: {
            where: {
              organizationId,
            },
            select: {
              status: true,
            },
          },
        },
      },
      invitations: {
        where: { status: "PENDING" },
        omit: { tokenHash: true },
      },
    },
  });

  return employees.map((employee: Employee) => ({
    ...employee,
    baseSalary:
      employee.baseSalary !== null ? Number(employee.baseSalary) : null,
  }));
}

export async function getEmployeeList({
  status = "CURRENT",
}: { status?: FilterStatusEmployee } = {}) {
  return withOrg([Role.OWNER, Role.ADMIN], getEmployeeListCached, status);
}

export async function getEmployeeByIdWithUser(id: string) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const employee = await prisma.employee.findFirst({
    where: {
      id: Number(id),
      organizationId: session.organizationId,
    },
    include: {
      employeeRole: true,
      user: {
        include: {
          memberships: {
            where: {
              organizationId: session.organizationId,
            },
          },
        },
      },
    },
  });

  if (!employee) {
    return null;
  }

  return {
    ...employee,
    baseSalary:
      employee.baseSalary !== null ? Number(employee.baseSalary) : null,
  };
}
