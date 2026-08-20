"use client";
import BackButton from "@/src/app/(main)/components/BackButton";
import { Expense } from "@prisma/client";
import Link from "next/link";
import React from "react";
import AdminListCard from "../../components/AdminListCard";
import { useRouter } from "next/navigation";
import { formatDate } from "@/src/utils/date.utils";
import { formatNumber } from "@/src/utils/price.utils";
import { deleteexpense } from "@/src/lib/actions/expenses.action";
import { toast } from "sonner";
import { refresh } from "next/cache";

type Props = {
  expenses: Expense[];
};

const ExpensesList = ({ expenses }: Props) => {
  const handleDelete = (id: number, description: string) => {
        const confirm = window.confirm(
      "Estas seguro que quieres eliminar el gasto " + description,
    );
    if (!confirm) return;
    try {
      deleteexpense(id);
      toast.success("Empleado eliminado");
      refresh()
    } catch {
      toast.error("Ocurrio un error al eliminar el empleado");
    }
  };

  const router = useRouter();

  return (
    <div className="">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <BackButton url="/admin/menu" />
          <h1 className="text-xl font-bold">Gastos</h1>
        </div>
        <Link
          href="/admin/gastos/crear"
          className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm"
        >
          Crear nuevo +
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((exp) => (
          <AdminListCard
            key={exp.id}
            item={exp}
            testId="supplier"
            title={(exp) => exp.category}
            badge={(exp) => formatDate(exp.date)}
            fields={[
              { key: "description", label: "Descripción" },
              {
                key: "amount",
                label: "Monto",
                render: (exp) => `$${formatNumber(exp.amount)}`,
              },
            ]}
            onEdit={(exp) => router.push(`/admin/gastos/${exp.id}/editar`)}
            onDelete={(exp) => handleDelete(exp.id, exp.description ?? "sin descripción" )}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpensesList;
