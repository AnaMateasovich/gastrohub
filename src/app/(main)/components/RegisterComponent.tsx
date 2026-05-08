"use client";
import { useForm } from "react-hook-form";
import { RegisterType } from "../../types/register.type";
import Input from "./Input";
import Button from "./Button";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const registerSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email invalido"),

  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),

  name: z.string().min(1, "El nombre es obligatorio"),

  areaCod: z.string().min(1, "Código obligatorio"),

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

const RegisterComponent = () => {
  const [onSubmiting, setOnSubmiting] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      areaCod: "+54",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterType) => {
    try {
      setOnSubmiting(true);

      const cleanArea = data.areaCod.replace(/\D/g, "");
      const cleanPhone = data.phone.replace(/\D/g, "");

      const fullPhone = `${cleanArea}${cleanPhone}`;

      const body = {
        ...data,
        phone: fullPhone,
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Error en el registro");
      }

      reset();
      router.push("/login");
    } catch (error) {
      console.error("Ocurrio un error al registrar");
    } finally {
      setOnSubmiting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        type="email"
        name="email"
        register={register}
        placeholder="Email"
        error={errors.email?.message}
        errorWhitBg={true}
      />
      <Input
        type="password"
        name="password"
        register={register}
        placeholder="Password"
        error={errors.password?.message}
        errorWhitBg={true}
      />
      <Input
        type="text"
        name="name"
        register={register}
        placeholder="Nombre"
        error={errors.name?.message}
        errorWhitBg={true}
      />
      <div className="flex gap-2 w-full">
        <div className="w-[30%]">
          <Input
            type="text"
            name="areaCod"
            placeholder="+54"
            error={errors.areaCod?.message}
            register={register}
            errorWhitBg={true}
          />
        </div>
        <div className="w-full">
          <Input
            type="text"
            name="phone"
            register={register}
            placeholder="3464636000"
            error={errors.phone?.message}
            errorWhitBg={true}
          />
        </div>
      </div>
      <Input
        type="text"
        name="address"
        register={register}
        placeholder="Dirección"
        error={errors.address?.message}
        errorWhitBg={true}
      />
      <div className="mt-4">
        <Button
          className="drop-shadow-md"
          type="submit"
          text="Resitrarse"
          onClick={() => null}
          disabled={!isValid || onSubmiting}
        />
      </div>
    </form>
  );
};

export default RegisterComponent;
