import React from "react";
import ExpensesList from "./ExpensesList";
import { Expense } from "@prisma/client";
import { getExpenseList } from "@/src/lib/expense";

const page = async () => {
  const expenses: Expense[] = await getExpenseList();
  return <ExpensesList expenses={expenses} />;
};

export default page;
