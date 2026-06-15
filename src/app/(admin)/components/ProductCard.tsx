import Image from "next/image";
import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteProductById,
  toggleProductActive,
} from "@/src/lib/actions/products.actions";
import { ProductWithRecipeAndCostsType } from "../../types/product.type";

type Props = {
  product: ProductWithRecipeAndCostsType;
  routerPush?: string;

  onDelete?: (id: number) => void;
};

const ProductCard = ({ product, onDelete, routerPush }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const handleDelete = async (id: number) => {
    await deleteProductById(id);
    onDelete?.(id);
    setMenuOpen(false);
  };
  (product);
  return (
    <div
      className="flex justify-between gap-2"
      onClick={() => routerPush && router.push(`${routerPush}/${product.slug}`)}
    >
      <div className="relative min-w-[80px]">
        <Image
          src={product.images[0].url}
          fill
          sizes="120px"
          alt={product.name}
          className="object-cover rounded-xl"
        />
      </div>
      <div className="self-start flex-1">
        <div className="flex items-center gap-2">
          <h5 className="font-bold text-lg">{product.name}</h5>
          <div
            className={`p-1 rounded-full ${product.isActive ? "bg-green-500" : "bg-orange-500"}`}
          ></div>
        </div>
        <p>
          {product.description && product.description.length > 50
            ? product.description.slice(0, 60) + "..."
            : product.description}
        </p>
        <div className="flex gap-2 mb-1">
          <p className="font-bold">${product.price}</p>
          <p className="text-gray-600">por {product.saleAmount}{product.saleUnit}</p>
        </div>
        <div className="flex w-full gap-1">
          <div className="w-full bg-[var(--color-natural-bg)] rounded-sm py-1 px-3 leading-tight">
            <p className="text-sm">Costo</p>
            <p>${product.profit?.cost} </p>
          </div>
          <div className="w-full bg-[var(--color-natural-bg)] rounded-sm py-1 px-3 leading-tight">
            <p className="text-sm">Ganancia</p>
            <p
              className={
                (product.profit?.profit ?? 0) > 0
                  ? "text-green-800"
                  : "text-red-600"
              }
            >
              ${product.profit?.profit || "No esp"} -{" "}
              {product.profit?.profitPercent}%{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="relative">
        <button
          className="text-3xl p-2 font-bold text-[var(--color-primary)]"
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
              className="px-4 py-2 text-left hover:bg-gray-50 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/productos/${product.slug}/editar`);
                setMenuOpen(false);
              }}
            >
              Editar
            </button>
            <button
              className="px-4 py-2 text-left hover:bg-gray-50 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleProductActive(product.id, product.isActive);
                setMenuOpen(false);
              }}
            >
              {product.isActive ? "Desactivar" : "Activar"}
            </button>
            <button
              className="px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product.id);
                setMenuOpen(false);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
