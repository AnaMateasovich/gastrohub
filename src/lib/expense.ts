"use server";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { withOrg } from "./auth/with-org";
import { Expense, Role } from "@prisma/client";
import { requireRole } from "./auth/role";

export async function getExpenseListCached(organizationId: string) {
  "use cache";
  cacheTag(`expense-${organizationId}`);
  cacheLife("max");

  const expenses = await prisma.expense.findMany({
    where: { organizationId },
    orderBy: { date: "desc" },
  });

  return expenses.map((expense: Expense) => ({
    ...expense,
    amount: Number(expense.amount),
    date: expense.date.toISOString(),
  }));
}

export async function getExpenseList() {
  return withOrg([Role.OWNER, Role.ADMIN], getExpenseListCached);
}

export async function getExpenseById(id: string) {
  
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const expense = await prisma.expense.findFirst({
    where: {
      id: Number(id),
      organizationId: session.organizationId,
    },
    include: {
      supplier: true,
      employee: true,
    },
  });

  const employee = expense.employee ? {
    ...expense.employee,
    roleId: Number(expense.employee.roleId),
    baseSalary: Number(expense.employee.baseSalary)
  } : null

  return {
    ...expense,
    amount: Number(expense.amount),
    employee
  };
}
