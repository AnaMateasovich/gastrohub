'use client'
import React, { useState } from "react";
import { CostType } from "../../types/cost.type";
import { EllipsisVertical } from "lucide-react";
import { deleteProductAndRecipe } from "../../services/products.service";
import { useRouter } from "next/navigation";

type RecipeCardProps = CostType & {
  onDelete?: (productId: number) => void
};

const RecipeCard = ({
  productName,
  marginPercent,
  productId,
  margin,
  productPrice,
  recipeCost,
  onDelete
}: RecipeCardProps) => {

  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  
  const router = useRouter()

  const handleDeleteRecipe = async (productId: number) => {
    await deleteProductAndRecipe(productId)
    onDelete?.(productId)
    setMenuOpen(false)
  }
console.log(productId)
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 flex flex-col gap-3 shadow-[var(--shadow-sm)]">
      <div className="flex justify-between items-start">
        <h5 className="font-bold text-lg text-base text-[var(--color-text-primary)]">
          {productName}
        </h5>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <EllipsisVertical />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-md z-10 flex flex-col min-w-[130px] border border-[var(--color-border)] z-99999">
              <button
                className="px-4 py-2 text-left hover:bg-gray-50 text-sm"
                onClick={() => router.push(`/admin/recetas/${productId}/editar`)}
              >
                Editar
              </button>
              <button
                className="px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-500"
                onClick={() => 
                  handleDeleteRecipe(productId)}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p>Margen: {marginPercent}%</p>
          <p>Costo: ${recipeCost}</p>
          <p>Precio: ${productPrice}</p>
        </div>
        <span className="bg-green-300 font-bold py-2 px-4 rounded-xl">
          $ {margin}
        </span>
      </div>
    </div>
  );
};

export default RecipeCard;
