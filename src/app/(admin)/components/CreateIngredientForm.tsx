"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Input from "../../(main)/components/Input";
import Button from "../../(main)/components/Button";
import { Ingredient } from "../../types/ingredient.type";
import { useRouter } from "next/navigation";

const ingredientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  unit: z.string().min(1, "La unidad es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  stock: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

type IngredientFormType = z.infer<typeof ingredientSchema>;

type CreateIngredientFormProps = {
  ingredientToEdit?: Ingredient;
};

const CreateIngredientForm = ({
  ingredientToEdit,
}: CreateIngredientFormProps) => {
  const [successMessage, setSuccessMessage] = useState<string>("");

  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IngredientFormType>({
    resolver: zodResolver(ingredientSchema),
    mode: "onChange",
    defaultValues: ingredientToEdit
      ? {
          name: ingredientToEdit.name,
          price: ingredientToEdit.price,
          unit: ingredientToEdit.unit,
          stock: ingredientToEdit.stock ? ingredientToEdit.stock : undefined,
        }
      : {
          unit: "kg",
        },
  });

  console.log(ingredientToEdit);

  const onSubmit = async (data: IngredientFormType) => {
    try {
      const res = await fetch(
        ingredientToEdit
          ? `/api/ingredients/${ingredientToEdit.id}`
          : "/api/ingredients",
        {
          method: ingredientToEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            unit: data.unit,
            price: data.price,
            ...(data.stock !== undefined &&
              !Number.isNaN(data.stock) && { stock: data.stock }),
            ...(ingredientToEdit && { id: ingredientToEdit.id }),
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Error al crear el ingrediente");
      }
      setSuccessMessage(
        ingredientToEdit ? "Ingrediente actualizado" : "Ingrediente creado",
      );
      setTimeout(() => {
        setSuccessMessage("");
        router.push("/admin/insumos");
      }, 2000);
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        type="text"
        name="name"
        register={register}
        placeholder="Nombre"
        error={errors.name?.message}
      />
      <Input
        type="number"
        name="price"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        placeholder="Precio"
        error={errors.price?.message}
      />
      <div
        className={`flex w-full bg-white border rounded-sm justify-between px-2 py-2 outline-none ${
          errors.unit ? "border-red-500" : "border-[var(--color-primary)]/60"
        } `}
      >
        <label htmlFor="">Unidad</label>
        <select {...register("unit")}>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="litro">litro</option>
          <option value="ml">ml</option>
          <option value="unidad">unidad</option>
        </select>
      </div>
      <Input
        type="number"
        name="stock"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        placeholder="Stock"
        error={errors.stock?.message}
      />
      <div className="mt-2">
        <Button type="submit" text={ingredientToEdit ? "Editar" : "Crear"} />
      </div>
      {successMessage && (
        <p className="text-center text-green-600 text-lg font-bold">
          {successMessage}
        </p>
      )}
    </form>
  );
};

export default CreateIngredientForm;
