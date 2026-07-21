"use client";
import { LoginType } from "../../types/login.type";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/UserContext";
import { login } from "@/src/lib/auth/login.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/src/lib/validations/login.schema";
import { useState } from "react";
import { toast } from "sonner";

const LoginComponent = () => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const { setUser } = useUser();

  const onSubmit = async (data: LoginType) => {
    try {
      setSubmitting(true);
      const user = await login(data);
      setUser(user);
      router.push("/home");
    } catch {
      toast.error("Email o contraseña incorrectos");
    } finally {
      setSubmitting(false);
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
      />
      <Input
        type="password"
        name="password"
        register={register}
        placeholder="Contraseña"
        error={errors.password?.message}
      />

      <div className="mt-2">
        <Button
          type="submit"
          text={submitting ? "Ingresando..." : "Ingresar"}
          onClick={() => null}
          disabled={submitting}
          className="drop-shadow-lg"
        />
      </div>
    </form>
  );
};

export default LoginComponent;