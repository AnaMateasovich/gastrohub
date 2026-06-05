"use client";
import UserProfileLetter from "./UserProfileLetter";
import Input from "./Input";
import z from "zod";
import { useUser } from "@/src/contexts/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "./Button";
import BackButton from "./BackButton";

const profileSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),

  phone: z
    .string()
    .min(6, "El celular es muy corto")
    .regex(/^\d+$/, "Solo números"),
  address: z
    .string()
    .min(1, "La dirección es obligatoria")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "La dirección debe contener letras y números",
    ),
});

type ProfileForm = z.infer<typeof profileSchema>;

const UserProfileEdit = () => {
  const { user } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  return (
    <div>
      <div className="flex flex-col items-center">
        <UserProfileLetter />
      </div>
      <div className="flex flex-col gap-3 mt-6">
        <Input
          type="text"
          placeholder="Nombre"
          name="name"
          register={register}
          error={errors.name?.message}
        />
            <Input
          type="text"
          placeholder="Apellido"
          name="lastname"
          register={register}
          error={errors.lastname?.message}
        />
        <Input
          type="text"
          placeholder="Teléfono"
          name="phone"
          register={register}
          error={errors.phone?.message}
        />
        <Input
          type="text"
          placeholder="Dirección"
          name="address"
          register={register}
          error={errors.address?.message}
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={() => null} text="Guardar" />
        <Button onClick={() => router.push("/perfil")} text="Cancelar" bgColor="bg-gray-500/80"/>
      </div>
    </div>
  );
};

export default UserProfileEdit;
