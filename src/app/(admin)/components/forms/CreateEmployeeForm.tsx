"use client";
import Button from "@/src/app/(main)/components/Button";
import Input from "@/src/app/(main)/components/Input";
import {
  createEmployee,
  updateEmployee,
} from "@/src/lib/employee/employee.action";
import {
  EmployeeInput,
  EmployeeOutput,
  employeeSchema,
} from "@/src/lib/validations/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee, EmployeeRole, Role, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RoleSelect from "./RoleSelect";
import { getAssignableRoles, roleLabels } from "@/src/lib/auth/role.utils";
import { inviteEmployeeAccess } from "@/src/lib/employee/inviteEmployee.action";
import { EmployeeWithUser } from "@/src/lib/employee/employee";

type Props = {
  employeeToEdit?: EmployeeWithUser;
  employeeRoles: EmployeeRole[];
};

const CreateEmployeeForm = ({ employeeToEdit, employeeRoles }: Props) => {
  const router = useRouter();

  const userRoles = getAssignableRoles();
  const alreadyHasAccess = Boolean(employeeToEdit?.user);

  const [wantsAccess, setWantsAccess] = useState(false);
  const [accessEmail, setAccessEmail] = useState("");
  const [accessRole, setAccessRole] = useState<Role>("STAFF");

  const {
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeInput, unknown, EmployeeOutput>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",

    defaultValues: employeeToEdit
      ? {
          name: employeeToEdit.name,
          employeeRoleId:
            employeeToEdit.employeeRoleId != null
              ? String(employeeToEdit.employeeRoleId)
              : "",
          phone: employeeToEdit.phone ?? "",
          baseSalary: employeeToEdit.baseSalary
            ? Number(employeeToEdit.baseSalary)
            : undefined,
          active: employeeToEdit.active,
        }
      : {
          name: "",
          employeeRoleId: "",
          phone: "",
          baseSalary: undefined,
          active: true,
        },
  });

  const employeeRoleId = watch("employeeRoleId");

  const onSubmit = async (data: EmployeeOutput) => {
    if (wantsAccess && !accessEmail) {
      toast.error("Ingresá un email para otorgar acceso");
      return;
    }

    let employee;
    try {
      if (employeeToEdit) {
        employee = await updateEmployee(employeeToEdit.id, data);
        toast.success("Empleado actualizado");
      } else {
        employee = await createEmployee(data);
        toast.success("Empleado creado");
      }
    } catch (error) {
      toast.error("Ocurrió un error al crear el empleado");
      return;
    }

    if (wantsAccess && !alreadyHasAccess) {
      try {
        await inviteEmployeeAccess({
          employeeId: employee.id,
          email: accessEmail,
          role: accessRole,
        });
        toast.success("Invitación enviada");
      } catch {
        toast.error("Empleado guardado, pero no se pudo enviar la invitación");
      }
    }

    reset();
    router.push("/admin/empleados");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          type="text"
          name="name"
          register={register}
          placeholder="Nombre"
          error={errors.name?.message}
        />

        <RoleSelect
          roles={employeeRoles}
          value={employeeRoleId}
          onChange={(id) =>
            setValue("employeeRoleId", id, { shouldValidate: true })
          }
        />

        <Input
          type="text"
          name="phone"
          register={register}
          placeholder="Teléfono"
          error={errors.phone?.message}
        />

        <Input
          type="number"
          name="baseSalary"
          register={register}
          placeholder="Salario base (referencia)"
          error={errors.baseSalary?.message}
        />
        {alreadyHasAccess ? (
          <p className="text-sm text-gray-500">
            Ya tiene acceso a la aplicación
          </p>
        ) : (
          <>
            <fieldset>
              <legend>¿Tiene acceso a la aplicación?</legend>
              <div>
                <input
                  type="radio"
                  id="yes"
                  checked={wantsAccess}
                  onChange={() => setWantsAccess(true)}
                />
                <label htmlFor="yes">Si</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="no"
                  checked={!wantsAccess}
                  onChange={() => setWantsAccess(false)}
                />
                <label htmlFor="no">No</label>
              </div>
            </fieldset>

            {wantsAccess && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                />
                <select
                  value={accessRole}
                  onChange={(e) => setAccessRole(e.target.value as Role)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  {userRoles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          text={
            isSubmitting ? "Creando" : employeeToEdit ? "Actualizar" : "Crear"
          }
          className="mt-2"
        />
      </form>
    </div>
  );
};

export default CreateEmployeeForm;
