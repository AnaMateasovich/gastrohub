"use client";
import { LoginType } from "../../types/login.type";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/UserContext";

const LoginComponent = () => {
  const { register, handleSubmit } = useForm<LoginType>();
  const router = useRouter();
  const { setUser } = useUser();

  const onSubmit = async (data: LoginType) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");

      const userRes = await fetch("/api/user", { credentials: "include" });
      const user = await userRes.json();
      setUser(user);

      router.push("/home");
    } catch (error) {
      console.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        type="email"
        name="email"
        register={register}
        placeholder="Email"
      />
      <Input
        type="password"
        name="password"
        register={register}
        placeholder="Password"
      />
      <div className="mt-4">
        <Button
          type="submit"
          text="Ingresar"
          onClick={() => null}
          className="drop-shadow-lg"
        />
      </div>
    </form>
  );
};

export default LoginComponent;
