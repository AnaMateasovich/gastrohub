"use client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerOrganization } from "@/src/lib/auth/register.action";
import { toast } from "sonner";
import { registerSchema } from "@/src/lib/validations/register.schema";
import { RegisterType } from "../../types/register.type";
import CompanyNameStep from "./CompanyNameStep";
import Input from "../../(main)/components/Input";
import PricingCards from "../../(main)/components/PricingCards";
import Button from "../../(main)/components/Button";

const RegisterComponent = () => {
  const [onSubmiting, setOnSubmiting] = useState<boolean>(false);
    const searchParams = useSearchParams(); 
    const preselectedPlan =
    searchParams.get("plan") as | "FREE" | "STARTER" | "PRO" | null;

  const {
    handleSubmit,
    register,
    trigger,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      companyName: "",
      slug: "",
      ownerName: "",
      ownerEmail: "",
      ownerPassword: "",
      ownerPasswordConfirm: "",
      plan: preselectedPlan ?? "FREE",
      acceptTerms: false,
    },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterType) => {
    console.log("regis")
    try {
      setOnSubmiting(true);
      const register = await registerOrganization(data);

      reset();
      toast.success("Cuenta creada, ya podés ingresar");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al crear tu cuenta");
    } finally {
      setOnSubmiting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
      onAnimationStart={(e) => {
        if (e.animationName === "onAutoFillStart") {
          trigger();
        }
      }}
    >
     <CompanyNameStep register={register} error={errors.companyName?.message}/>
      <Input
        type="text"
        name="slug"
        register={register}
        placeholder="Dominio (ej: mipanaderia)"
        error={errors.slug?.message}
        errorWhitBg={true}
      />
      <Input
        type="text"
        name="ownerName"
        register={register}
        placeholder="Nombre del dueño"
        error={errors.ownerName?.message}
        errorWhitBg={true}
      />
      <Input
        type="email"
        name="ownerEmail"
        register={register}
        placeholder="Email del dueño"
        error={errors.ownerEmail?.message}
        errorWhitBg={true}
      />
      <Input
        type="password"
        name="ownerPassword"
        register={register}
        placeholder="Contraseña"
        error={errors.ownerPassword?.message}
        errorWhitBg={true}
      />
      <Input
        type="password"
        name="ownerPasswordConfirm"
        register={register}
        placeholder="Repetí la contraseña"
        error={errors.ownerPasswordConfirm?.message}
        errorWhitBg={true}
      />

      <div className="mt-4">
        <PricingCards
          setValue={setValue}
          watch={watch}
          error={errors.plan?.message}
        />
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        <input type="checkbox" {...register("acceptTerms")} />
        <label htmlFor="acceptTerms" className="text-sm">
          Acepto los términos y condiciones
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-red-500 text-xs text-center -mt-2">
          {errors.acceptTerms.message}
        </p>
      )}

      <Button text="Registrarme" type="submit" disabled={onSubmiting} onClick={() => {console.log("click")}}/>
    </form>
  );
};

export default RegisterComponent;
