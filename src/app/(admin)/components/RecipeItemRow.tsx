import React from "react";
import { Ingredient } from "../../types/ingredient.type";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { getDisplayUnit } from "@/src/lib/units";
import Input from "../../(main)/components/Input";

type Props = {
  index: number;
  ingredients: Ingredient[];
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  onRemove: () => void;
};

const RecipeItemRow = ({
  index,
  ingredients,
  register,
  watch,
  onRemove,
}: Props) => {
  const selectedId = watch(`items.${index}.ingredientId`);
  const selectedIngredient = ingredients.find((ing) => ing.id === selectedId);
  const displayUnit = selectedIngredient
    ? getDisplayUnit(selectedIngredient.unit)
    : "";

  console.log({
    index,
    selectedId,
    selectedIngredient,
  });

  return (
    <div className="flex gap-2">
      <select
        value={watch(`items.${index}.ingredientId`) || 0}
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
            {ing.name} ({getDisplayUnit(ing.unit)})
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          name={`items.${index}.quantity`}
          placeholder="Cantidad"
          register={register}
          registerOptions={{ valueAsNumber: true }}
        />
        {displayUnit && (
          <span className="text-sm text-gray-500 font-medium">
            {displayUnit}
          </span>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="font-bold text-red-600"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default RecipeItemRow;
