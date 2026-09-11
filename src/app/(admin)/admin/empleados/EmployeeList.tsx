"use client";
import AdminListCard from "../../components/AdminListCard";
import { useRouter } from "next/navigation";
import BackButton from "@/src/app/(main)/components/BackButton";
import Link from "next/link";
import { toast } from "sonner";
import { refresh } from "next/cache";
import { desactivateEmployee } from "@/src/lib/employee/employee.action";
import {
  EmployeeWithAccessStatus,
  FilterStatusEmployee,
} from "@/src/lib/employee/employee";
import { getEmployeeAccessStatus } from "@/src/lib/employee/access-status";
import { Mail, ShieldMinus, ShieldPlus, UserMinus, UserPlus } from "lucide-react";
import { inviteEmployee } from "@/src/lib/employee/inviteEmployee.action";
import { Role } from "@prisma/client";
import { useState } from "react";

type Props = {
  employees: EmployeeWithAccessStatus[];
  currentStatus: FilterStatusEmployee;
};
const EmployeeList = ({ employees, currentStatus }: Props) => {
  const [selected, setSelected] = useState<FilterStatusEmployee>(currentStatus);
  const router = useRouter();

  const handleFilterChange = (status: FilterStatusEmployee) => {
    setSelected(status);
    router.push(`?status=${status}`);
  };

  const handleDesactivate = async (id: number, name: string) => {
    const confirm = window.confirm(
      "Estas seguro que quieres desactivar el empleado " + name,
    );
    if (!confirm) return;
    try {
      await desactivateEmployee(id);
      toast.success("Empleado desactivado");
      refresh();
    } catch {
      toast.error("Ocurrio un error al desactivar el empleado");
    }
  };

  const handleActivate = async (id: number, name: string) => {
    const confirm = window.confirm(
      "Estas seguro que quieres activar el empleado " + name,
    );
    if (!confirm) return;
    try {
      // todo: activar empleado fn
      toast.success("Empleado activado");
      refresh();
    } catch {
      toast.error("Ocurrio un error al activar el empleado");
    }
  };

  const resendInvitation = async (
    email?: string | null,
    employeeRoleId?: string | null,
    role?: Role,
  ) => {
    if (!email || !employeeRoleId || !role) {
      toast.error("Datos insuficientes, prueba editando el usuario");
      return;
    }
    try {
      await inviteEmployee({ email, employeeRoleId, role });
      toast.success("Invitación reenviada");
    } catch (error) {
      toast.error("Error al reenviar la invitación");
    }
  };

  const buttonStatus: { id: FilterStatusEmployee; label: string }[] = [
    { id: "ALL", label: "Todos" },
    { id: "CURRENT", label: "Empleados" },
    { id: "FORMER", label: "Ex empleados" },
  ];

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
      <div className="mb-3 flex gap-1">
        {buttonStatus.map((status) => (
          <button
            key={status.id}
            onClick={() => handleFilterChange(status.id)}
            className={`px-3 py-1 rounded-sm whitespace-nowrap ${selected === status.id ? "bg-[var(--color-primary)] text-white" : "bg-gray-200"}`}
          >
            {status.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((e) => {
          const accessStatus = getEmployeeAccessStatus(e);

          const actions = [];

          if (accessStatus === "PENDING") {
            const pendingInvitation = e.invitations.find(
              (inv) => inv.status === "PENDING",
            );

            actions.push({
              label: "Reenviar invitación",
              icon: Mail,
              iconSize: 10,
              onClick: () =>
                resendInvitation(
                  pendingInvitation?.email,
                  pendingInvitation?.employeeRoleId,
                  pendingInvitation?.role,
                ),
            });
          }
          if (e.active) {
            actions.push({
              label: "Dar de baja",
              icon: UserMinus,
              iconSize: 20,
              onClick: () => handleDesactivate(e.id, e.name),
            });
          } else {
            actions.push({
              label: "Reincorporar",
              icon: UserPlus,
              iconSize: 20,
              onClick: () => handleActivate(e.id, e.name),
            });
          }
          return (
            <AdminListCard
              key={e.id}
              item={e}
              testId="employee"
              title={(e) => e.name}
              badge={(e) => e.employeeRole?.name}
              status={(e) =>
                e.active
                  ? { label: "Empleado", variant: "success" }
                  : { label: "Ex empleado", variant: "neutral" }
              }
              fields={[
                {
                  key: "access",
                  label: "Acceso al sistema",
                  render: () =>
                    accessStatus === "ACTIVE"
                      ? "✅ Activo"
                      : accessStatus === "PENDING"
                        ? "⏳ Invitación enviada"
                        : "— Sin acceso",
                },
                { key: "phone", label: "Teléfono" },
                {
                  key: "baseSalary",
                  label: "Salario",
                  emphasis: true,
                  render: (e) => `$${e.baseSalary}`,
                },
              ]}
              onEdit={(e) => router.push(`/admin/empleados/${e.id}/editar`)}
              extraActions={actions}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeList;
