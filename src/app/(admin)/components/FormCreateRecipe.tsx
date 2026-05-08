"use client";
import React, { useEffect, useState } from "react";
import Input from "../../(main)/components/Input";
import z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ingredient } from "@prisma/client";
import Button from "../../(main)/components/Button";
import { useRouter } from "next/navigation";

const recipeItemSchema = z.object({
  ingredientId: z.number().min(1, "Seleccioná un ingrediente"),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
});

const recipeSchema = z.object({
  items: z.array(recipeItemSchema).min(1, "Agregá al menos un ingrediente"),
});

type FormCreateRecipeProps = {
  productId: number;
  defaultItems?: { ingredientId: number; quantity: number }[];
};

type RecipeFormType = z.infer<typeof recipeSchema>;

const FormCreateRecipe = ({ productId, defaultItems }: FormCreateRecipeProps) => {
console.log(defaultItems)
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = defaultItems && defaultItems.length > 0;
const router = useRouter()
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch("/api/ingredients", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("No se pudieron obtener los ingredientes");
        }
        const data = await res.json();
        setIngredients(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIngredients();
  }, []);
  
  const { control, handleSubmit, register, reset } = useForm<RecipeFormType>({
    resolver: zodResolver(recipeSchema),
        defaultValues: { 
      items: defaultItems ?? [{ ingredientId: 0, quantity: 0 }] 
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  
  const onSubmit = async (data: RecipeFormType) => {
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          items: data.items,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Ocurrio un error al crear la receta");
      }
      setSuccessMessage(isEditing ? "Receta editada": "Receta creada");
      setTimeout(() => {
        setSuccessMessage("");
        router.push('/admin/recetas')
      }, 1000);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  if (defaultItems && defaultItems.length > 0 && ingredients.length > 0) {
    reset({ items: defaultItems });  
  }
}, [defaultItems, ingredients]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <select
            {...register(`items.${index}.ingredientId`, {
              valueAsNumber: true,
            })}
            className="bg-white px-2 rounded-md shadow-md py-1"
          >
            <option value={0} className="">
              Selecciona un ingrediente
            </option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({ing.unit})
              </option>
            ))}
          </select>
          <Input
            type="number"
            name={`items.${index}.quantity`}
            placeholder="Cantidad"
            register={register}
            registerOptions={{ valueAsNumber: true }}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="font-bold text-red-600"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ ingredientId: 0, quantity: 0 })}
        className="py-1 bg-[var(--color-primary-light)] text-white font-bold text-lg rounded-md mt-2"
      >
        + Agregar ingrediente
      </button>
      <Button type="submit" text={isEditing ? 'Editar' : 'Crear'} className="mt-2" />
      {successMessage && (
        <p className="text-green-600 font-medium text-center px-4">
          {successMessage}
        </p>
      )}
    </form>
  );
};

export default FormCreateRecipe;
