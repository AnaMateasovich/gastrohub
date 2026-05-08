import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

type IngredientCardProps = {
  ingredientId: number;
  name: string;
  unit: string;
  price: number;
  stock?: number;
  onDelete: (id: number) => void;
};

const IngredientCard = ({
  ingredientId,
  name,
  unit,
  price,
  stock,
  onDelete,
}: IngredientCardProps) => {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "Seguro que quieres eliminar el insumo " + name,
    );
    if (!confirm) return;
    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        setTimeout(() => {
          setError("");
        }, 4000);
        return;
      }
      onDelete(id);
      setError("");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 flex flex-col gap-2 shadow-[var(--shadow-sm)]">
        <div className="flex justify-between items-center">
          <h5 className="font-bold text-[var(--color-text-primary)] text-base m-0">
            {name}
          </h5>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-natural-bg)] text-[var(--color-primary-dark)]">
              {unit}
            </span>
            <button
              onClick={() =>
                router.push(`/admin/insumos/${ingredientId}/editar`)
              }
              className="p-1 text-[var(--color-primary)]"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(ingredientId)}
              className="p-1 text-red-500"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-2">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] m-0">
              Precio
            </p>
            <p className="text-base font-medium text-[var(--color-text-primary)] m-0">
              ${price}
            </p>
          </div>
          {stock !== undefined && (
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-secondary)] m-0">
                Stock
              </p>
              <p className="text-base font-medium text-[var(--color-text-primary)] m-0">
                {stock} {unit}
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="text-red-600 text-sm px-2">{error}</p>
    </>
  );
};

export default IngredientCard;
