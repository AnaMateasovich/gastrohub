"use server";
import { Role } from "@prisma/client";
import { requireRole } from "../auth/role";
import { prisma } from "../prisma";
import { revalidateTag } from "next/cache";
import { EmployeeInput, employeeSchema } from "../validations/employee.schema";

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

  return employee;
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
    roleId: Number(employee.roleId),
    baseSalary:
      employee.baseSalary !== null ? Number(employee.baseSalary) : null,
  };
}

export async function deleteEmployee(id: number) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const employee = await prisma.employee.delete({
    where: {
      id,
      organizationId: session.organizationId,
    },
  });
  revalidateTag(`employee-${session.organizationId}`, "");
}
