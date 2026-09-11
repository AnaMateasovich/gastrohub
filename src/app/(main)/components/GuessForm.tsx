"use client";
import Input from "./Input";
import { GuessType } from "../../types/guess.type";
import Button from "./Button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useCart } from "@/src/contexts/CartContext";
import { createOrder } from "@/src/lib/actions/orders.action";
import { useRouter } from "next/navigation";

const guessSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email invalido"),

  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),

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

const GuessForm = () => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [onSubmiting, setOnSubmiting] = useState<boolean>(false);

const router = useRouter()

  const { cart, clearCart, wantsDelivery } = useCart();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<GuessType>({
    resolver: zodResolver(guessSchema),
    mode: "onChange",
    defaultValues: {
      areaCod: "+54",
    },
  });

  const onSubmit = async (data: GuessType) => {
    try {
      setOnSubmiting(true);
      const cleanArea = data.areaCod.replace(/\D/g, "");
      const cleanPhone = data.phone.replace(/\D/g, "");

      const fullPhone = `${cleanArea}${cleanPhone}`;

      
    await createOrder({
      customerName: data.name,
      customerLastname: data.lastname,
      phone: fullPhone,
      email: data.email,
      address: data.address,
      customerId: null,
      wantsDelivery: wantsDelivery,
      orderItems: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    })

    reset()
    clearCart()
    setSuccessMessage("✅ Tu pedido fue recibido. Nos pondremos en contacto contigo en breve.")
    setTimeout(() => {setSuccessMessage("")
    router.push('/home')}, 4000)
    
  } catch (error) {
    console.error(error)
  } finally {
    setOnSubmiting(false)
  }
}

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
        type="text"
        name="name"
        register={register}
        placeholder="Nombre"
        error={errors.name?.message}
      />
       <Input
        type="text"
        name="lastname"
        register={register}
        placeholder="Aoellido"
        error={errors.lastname?.message}
      />
      <div className="flex gap-2 w-full">
        <div className="w-[30%]">
          <Input
            type="text"
            name="areaCod"
            placeholder="+54"
            register={register}
            error={errors.areaCod?.message}
          />
        </div>
        <div className="w-full">
          <Input
            type="text"
            name="phone"
            register={register}
            placeholder="3464636000"
            error={errors.phone?.message}
          />
        </div>
      </div>
      <Input
        type="text"
        name="address"
        register={register}
        placeholder="Dirección"
        error={errors.address?.message}
      />
      {successMessage && (
        <p className="text-green-600 font-medium">{successMessage}</p>
      )}
      <div>
        <Button
          className="drop-shadow-md"
          type="submit"
          text="Continuar compra"
          disabled={!isValid || onSubmiting}
        />
      </div>
      
    </form>
  );
};

export default GuessForm;
