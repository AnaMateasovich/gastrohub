"use client";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../(main)/components/Button";
import RecipeItemRow from "../recipes/RecipeItemRow";
import { Ingredient } from "../../../types/ingredient.type";
import {
  createRecipeSchema,
  CreateRecipeType,
} from "@/src/lib/validations/recipe.schema";
import Input from "../../../(main)/components/Input";
import { toDisplayUnit, YIELD_UNITS } from "@/src/lib/units";
import { createRecipe, updateRecipe } from "@/src/lib/actions/recipe.action";
import { useRouter } from "next/navigation";
import { RecipeType } from "../../../types/recipe.type";
import { toast } from "sonner";

type FormCreateRecipeProps = {
  onRecipeReady?: (data: CreateRecipeType) => void;
  recipeToEdit?: RecipeType;
};

const FormCreateRecipe = ({
  onRecipeReady,
  recipeToEdit,
}: FormCreateRecipeProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [createAndContinue, setCreateAndContinue] = useState(false);

  const router = useRouter();

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

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecipeType>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: !recipeToEdit
      ? {
          name: "",
          yield: undefined,
          yieldUnit: "kg",
          items: [{ ingredientId: 0, quantity: 0 }],
        }
      : {
          name: recipeToEdit.name,
          yield: recipeToEdit.yield,
          yieldUnit: recipeToEdit.yieldUnit,
          items: recipeToEdit.items.map((i) => ({
            ingredientId: i.ingredientId,
            quantity: toDisplayUnit(i.quantity, i.unit),
          })),
        },
  });
console.log(recipeToEdit)
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: CreateRecipeType) => {
    try {
      if (recipeToEdit) {
        await updateRecipe({
          id: recipeToEdit.id,
          ...data,
        });
        toast.success("Receta actualizada");
        router.push("/admin/menu/recetas");
      } else if (onRecipeReady) {
        onRecipeReady(data);
        reset();
      } else {
        await createRecipe(data);
        toast.success("Receta creada");
        reset();
        if (!createAndContinue) {
          router.push("/admin/menu/recetas");
        }
      }
    } catch (error) {
      toast.error("Ocurrio un error al crear la receta");
    }
  };

  useEffect(() => {
    if (!recipeToEdit) return;

    replace(
      recipeToEdit.items.map((i) => ({
        ingredientId: i.ingredientId,
        quantity: toDisplayUnit(i.quantity, i.unit),
      })),
    );

    reset({
      name: recipeToEdit.name,
      yield: recipeToEdit.yield,
      yieldUnit: recipeToEdit.yieldUnit,
      items: recipeToEdit.items.map((i) => ({
        ingredientId: i.ingredientId,
        quantity: toDisplayUnit(i.quantity, i.unit),
      })),
    });
  }, [recipeToEdit, reset, replace]);

  fields;
  watch("items");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        type="text"
        name="name"
        error={errors.name?.message}
        placeholder="Nombre de la receta"
        register={register}
      />
      <Input
        type="number"
        name="yield"
        placeholder="¿Cuánto rinde esta receta? ej: 3"
        error={errors.yield?.message}
        register={register}
        registerOptions={{ valueAsNumber: true }}
      />
      <select
        data-testid={`yeildUnit`}
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

      <Button
        type="submit"
        disabled={isSubmitting}
        text={recipeToEdit ? "Actualizar" : "Crear"}
        className="mt-2"
        onClick={() => setCreateAndContinue(false)}
      />
      {!recipeToEdit && (
        <Button
          type="submit"
          disabled={isSubmitting}
          text={isSubmitting ? "Creando..." : "Guardar y crear otra"}
          onClick={() => setCreateAndContinue(true)}
        />
      )}
    </form>
  );
};

export default FormCreateRecipe;
