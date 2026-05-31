"use client";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../(main)/components/Button";
import RecipeItemRow from "./RecipeItemRow";
import { Ingredient } from "../../types/ingredient.type";
import {
  createRecipeSchema,
  CreateRecipeType,
} from "@/src/lib/validations/recipe.schema";
import Input from "../../(main)/components/Input";
import { YIELD_UNITS } from "@/src/lib/units";

type FormCreateRecipeProps = {
  onRecipeReady: (data: CreateRecipeType) => void;
};

const FormCreateRecipe = ({ onRecipeReady }: FormCreateRecipeProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch("/api/ingredients", { method: "GET" });
        if (!res.ok) throw new Error("No se pudieron obtener los ingredientes");
        const data = await res.json();
        setIngredients(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIngredients();
  }, []);

  const { control, handleSubmit, register, watch } = useForm<CreateRecipeType>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: "",
      yield: undefined,
      yieldUnit: "kg",
      items: [{ ingredientId: 0, quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = (data: CreateRecipeType) => {
    onRecipeReady(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        type="text"
        name="name"
        placeholder="Nombre de la receta"
        register={register}
      />
      <Input
        type="number"
        name="yield"
        placeholder="¿Cuánto rinde esta receta? ej: 3"
        register={register}
        registerOptions={{ valueAsNumber: true }}
      />
      <select
        {...register("yieldUnit")}
        className="w-full bg-white border rounded-sm px-2 py-2 outline-none border-[var(--color-primary)]/60"
      >
        <option value="">Unidad de rendimiento</option>
        {YIELD_UNITS.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </select>
      {fields.map((field, index) => (
        <RecipeItemRow
          key={field.id}
          index={index}
          ingredients={ingredients}
          register={register}
          watch={watch}
          onRemove={() => remove(index)}
        />
      ))}
      <button
        type="button"
        onClick={() => append({ ingredientId: 0, quantity: 0 })}
        className="py-1 bg-[var(--color-primary-light)] text-white font-bold text-lg rounded-md mt-2"
      >
        + Agregar ingrediente
      </button>
      <Button type="submit" text="Listo" className="mt-2" />
    </form>
  );
};

export default FormCreateRecipe;