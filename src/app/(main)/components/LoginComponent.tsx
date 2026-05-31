"use client";
import { LoginType } from "../../types/login.type";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/UserContext";
import { login } from "@/src/lib/actions/login.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/src/lib/validations/login.schema";

const LoginComponent = () => {
  
const { register, handleSubmit, formState: { errors } } = useForm<LoginType>({
  resolver: zodResolver(loginSchema),
  mode: "onChange",
});
  const router = useRouter();

  const { setUser } = useUser();
  

  const onSubmit = async (data: LoginType) => {
    const user = await login(data);
    setUser(user);
    router.push(`/home`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
        placeholder="Password"
        error={errors.password?.message}
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
