"use client";
import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { RecipeWithCostType } from "../../../types/recipe.type";
import { deleteRecipeById } from "@/src/lib/actions/recipe.action";
import { toast } from "sonner";

type Props = {
  recipe: RecipeWithCostType;
  onDelete?: (productId: number) => void;
};

const RecipeCard = ({ recipe, onDelete }: Props) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleDeleteRecipe = async (recipeId: number, recipeName: string) => {
    try {
      const confirmed = confirm(
        `Seguro que quieres eliminar la receta ${recipeName}`,
      );
      if (!confirmed) return;
      await deleteRecipeById(recipeId);
      onDelete?.(recipeId);
      toast.success("Receta eliminada");
      setMenuOpen(false);
    } catch (error) {
      toast.error("Ocurrio un error al eliminar la receta");
    }
  };

  return (
    <div
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 flex flex-col gap-3 shadow-[var(--shadow-sm)]"
      onClick={() => router.push(`/admin/recetas/${recipe.id}`)}
    >
      <div className="flex justify-between items-start">
        <h5
          data-testid={`recipe-name-${recipe.name}`}
          className="font-bold text-lg text-base text-[var(--color-text-primary)]"
        >
          {recipe.name}
        </h5>
        <div className="relative">
          <button
            data-testid={`btn-options-${recipe.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <EllipsisVertical />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-md z-10 flex flex-col min-w-[130px] border border-[var(--color-border)] z-99999">
              <button
                data-testid={`btn-edit-${recipe.name}`}
                className="px-4 py-2 text-left hover:bg-gray-50 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/recetas/${recipe.id}/editar`);
                  setMenuOpen(!menuOpen);
                }}
              >
                Editar
              </button>
              <button
                data-testid={`btn-delete-${recipe.name}`}

                className="px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecipe(recipe.id, recipe.name);
                  setMenuOpen(!menuOpen);
                }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p>
            Costo total: <strong>${recipe.totalCost}</strong>
          </p>
          <p>
            Rinde:{" "}
            <strong data-testid={`yeild-${recipe.name}`}>
              {recipe.yield}
              {recipe.yieldUnit}
            </strong>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-sm">Costo por {recipe.yieldUnit}</p>
          <p className=" bg-green-300  py-2 px-4 rounded-xl font-bold">
            $ {recipe.costPerUnit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
