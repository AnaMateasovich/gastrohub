"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { acceptInvitation } from "@/src/lib/auth/acceptInvitation";
import Input from "../../(main)/components/Input";
import Button from "../../(main)/components/Button";

const acceptInvitationFormSchema = z
  .object({
    name: z.string().min(2, "Ingresá tu nombre completo"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type AcceptInvitationFormValues = z.infer<typeof acceptInvitationFormSchema>;

interface AcceptInvitationFormProps {
  token: string;
  email: string;
  roleName: string;
  organizationName: string;
}

export function AcceptInvitationForm({
  token,
  email,
  roleName,
  organizationName,
}: AcceptInvitationFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: AcceptInvitationFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      await acceptInvitation({
        token,
        name: values.name,
        password: values.password,
      });
    } catch (error) {
      setServerError(
        "Este link ya no es válido. Puede que ya lo hayas usado, o que haya expirado.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border-2 border-gray-200 bg-white shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Te invitaron a unirte a<br />
            <span className="text-[var(--color-primary-dark)]">
              {organizationName}
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            Vas a ingresar como{" "}
            <span className="font-medium text-gray-700">{roleName}</span> con el
            email <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            type="text"
            name="name"
            register={register}
            placeholder="Nombre completo"
            error={errors.name?.message}
          />
          <Input
            type="password"
            name="password"
            register={register}
            placeholder="Contraseña"
            error={errors.password?.message}
          />
          <Input
            type="password"
            name="confirmPassword"
            register={register}
            placeholder="Confirmar contraseña"
            error={errors.confirmPassword?.message}
          />

          {serverError && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2"
            >
              {serverError}
            </p>
          )}

          <div className="mt-2">
            <Button
              type="submit"
              text={isSubmitting ? "Creando cuenta..." : "Aceptar invitación"}
              onClick={() => null}
              disabled={isSubmitting}
              className="drop-shadow-lg w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
