"use client";
import Button from "@/src/app/(main)/components/Button";
import Input from "@/src/app/(main)/components/Input";
import { createSupplier, updateSupplier } from "@/src/lib/actions/supplier.action";
import {
  SupplierInput,
  SupplierOutput,
  supplierSchema,
} from "@/src/lib/validations/supplier.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Supplier } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  supplierToEdit?: Supplier;
};

const CreateSupplierForm = ({ supplierToEdit }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierInput, unknown, SupplierOutput>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange",

    defaultValues: supplierToEdit
      ? {
          name: supplierToEdit.name,
          contactName: supplierToEdit.contactName ?? "",
          phone: supplierToEdit.phone ?? "",
          email: supplierToEdit.email ?? "",
          active: supplierToEdit.active,
        }
      : {
          name: "",
          contactName: "",
          phone: "",
          email: "",
          active: true,
        },
  });

  const onSubmit = async (data: SupplierInput) => {
    try {
      if (supplierToEdit) {
        await updateSupplier(supplierToEdit.id, data)
        toast.success("Proveedor actualizado");
      } else {
        await createSupplier(data);
        toast.success("Proveedor creado");
      }
      reset();
      router.refresh()
      router.push("/admin/proveedores");
    } catch (error) {
      toast.error("Ocurrio un error al crear el proveedor");
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
        <Input
          type="text"
          name="contactName"
          register={register}
          placeholder="Nombre de contacto"
          error={errors.contactName?.message}
        />
        <Input
          type="text"
          name="phone"
          register={register}
          placeholder="Teléfono"
          error={errors.phone?.message}
        />

        <Input
          type="text"
          name="email"
          register={register}
          placeholder="Email"
          error={errors.email?.message}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          text={
            isSubmitting ? "Creando" : supplierToEdit ? "Actualizar" : "Crear"
          }
          className="mt-2"
        />
      </form>
    </div>
  );
};

export default CreateSupplierForm;
