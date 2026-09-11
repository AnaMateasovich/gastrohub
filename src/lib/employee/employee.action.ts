"use server";
import { Role } from "@prisma/client";
import { requireRole } from "../auth/role";
import { prisma } from "../prisma";
import { revalidateTag } from "next/cache";
import { EmployeeInput, employeeSchema } from "../validations/employee.schema";
import { withOrg } from "../auth/with-org";

export async function createEmployee(data: EmployeeInput) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const parsed = employeeSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const employee = await prisma.employee.create({
    data: {
      organizationId: session.organizationId,
      ...parsed.data,
    },
  });
  revalidateTag(`employee-${session.organizationId}`, "");

  return { ...employee, employeeRoleId: String(employee.employeeRoleId) };
}

export async function updateEmployee(id: number, data: EmployeeInput) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const parsed = employeeSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const employee = await prisma.employee.update({
    where: {
      id,
      organizationId: session.organizationId,
    },
    data: parsed.data,
  });
  revalidateTag(`employee-${session.organizationId}`, "");

  return {
    ...employee,
    employeeRoleId: String(employee.employeeRoleId),
    baseSalary:
      employee.baseSalary !== null ? Number(employee.baseSalary) : null,
  };
}

export async function desactivateEmployee(employeeId: number) {
  return withOrg(["OWNER"], async (organizationId) => {
    const employee = await prisma.employee.update({
      where: { id: employeeId, organizationId },
      data: { active: false },
    });

    if (employee.userId) {
      await revokeSystemAccess(employee.userId, organizationId);
    }

    await prisma.invitation.updateMany({
      where: { employeeId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    revalidateTag(`employee-${organizationId}`, "");
  });
}

export async function revokeSystemAccess(
  userId: string,
  organizationId: string,
) {
  await prisma.membership.updateMany({
    where: {userId, organizationId},
    data: {status: "INACTIVE"}
  })
}
