"use server";
import {  updateTag } from "next/cache";
import { requireRole } from "../auth/role";
import { ExpenseInput, expenseSchema } from "../validations/expense.schema";
import { prisma } from "../prisma";
import {  Role } from "@prisma/client";

export async function createExpense(data: ExpenseInput) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const parsed = expenseSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const expense = await prisma.expense.create({
    data: {
      organizationId: session.organizationId,
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });
  updateTag(`expense-${session.organizationId}`);

  return {
    ...expense,
    amount: Number(expense.amount),
    date: expense.date.toISOString(),
  };
}

export async function updateExpense(id: number, data: ExpenseInput) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const parsed = expenseSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos inválidos");
  }

  const expense = await prisma.expense.update({
    where: {
      id,
      organizationId: session.organizationId,
    },
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  updateTag(`expense-${session.organizationId}`);

  return {
    ...expense,
    amount: Number(expense.amount),
    date: expense.date.toISOString(),
  };
}

export async function deleteexpense(id: number) {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const expense = await prisma.expense.delete({
    where: {
      id,
      organizationId: session.organizationId,
    },
  });
  updateTag(`expense-${session.organizationId}`);

}
