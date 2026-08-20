"use client";
import Button from "@/src/app/(main)/components/Button";
import Input from "@/src/app/(main)/components/Input";
import { createEmployee, updateEmployee } from "@/src/lib/actions/employee.action";
import {
  EmployeeInput,
  EmployeeOutput,
  employeeSchema,
} from "@/src/lib/validations/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee, EmployeeRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RoleSelect from "./RoleSelect";

type Props = {
  employeeToEdit?: Employee;
  roles: EmployeeRole[];
};

const CreateEmployeeForm = ({ employeeToEdit, roles }: Props) => {
  const router = useRouter();

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
          roleId:
            employeeToEdit.roleId != null ? String(employeeToEdit.roleId) : "",
          phone: employeeToEdit.phone ?? "",
          baseSalary: employeeToEdit.baseSalary
            ? Number(employeeToEdit.baseSalary)
            : undefined,
          active: employeeToEdit.active,
        }
      : {
          name: "",
          roleId: "",
          phone: "",
          baseSalary: undefined,
          active: true,
        },
  });

  const roleId = watch("roleId");

  const onSubmit = async (data: EmployeeOutput) => {
    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.id, data)
        toast.success("Empleado actualizado");
      } else {
        await createEmployee(data);
        toast.success("Empleado creado");
      }
      reset();
      router.push("/admin/empleados");
    } catch (error) {
      toast.error("Ocurrió un error al crear el empleado");
    }
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
          roles={roles}
          value={roleId}
          onChange={(id) => setValue("roleId", id, { shouldValidate: true })}
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
