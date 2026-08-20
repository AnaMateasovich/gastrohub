"use client";
import { Employee } from "@prisma/client";
import React from "react";
import AdminListCard from "../../components/AdminListCard";
import { useRouter } from "next/navigation";
import BackButton from "@/src/app/(main)/components/BackButton";
import Link from "next/link";
import { toast } from "sonner";
import { refresh } from "next/cache";
import { deleteEmployee } from "@/src/lib/actions/employee.action";
import { EmployeeWithRole } from "@/src/lib/employee";

type Props = {
  employees: EmployeeWithRole[];
};
const EmployeeList = ({ employees }: Props) => {
  const handleDelete = (id: number, name: string) => {
    const confirm = window.confirm(
      "Estas seguro que quieres eliminar el empleado " + name,
    );
    if (!confirm) return;
    try {
      deleteEmployee(id);
      toast.success("Empleado eliminado");
      refresh()
    } catch {
      toast.error("Ocurrio un error al eliminar el empleado");
    }
  };
  const router = useRouter();
  return (
    <div className="">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BackButton url="/admin/menu" />
          <h1 className="text-xl font-bold">Empleados</h1>
        </div>
        <Link
          href="/admin/empleados/crear"
          className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm"
        >
          Crear nuevo +
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((e) => (
          <AdminListCard
            key={e.id}
            item={e}
            testId="supplier"
            title={(e) => e.name}
            badge={(e) => e.role?.name}
            fields={[
              { key: "phone", label: "Teléfono" },
              {
                key: "baseSalary",
                label: "Salario",
                emphasis: true,
                render: (e) =>  `$${e.baseSalary}`
              },
            ]}
            onEdit={(e) => router.push(`/admin/empleados/${e.id}/editar`)}
            onDelete={(e) => handleDelete(e.id, e.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
