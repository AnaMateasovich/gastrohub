"use client";
import Image from "next/image";
import { EllipsisVertical, Minus, Plus, Check, Trash } from "lucide-react";
import { ProductType } from "../../types/product.type";
import { useState } from "react";
import { deleteProductAndRecipe } from "../../services/products.service";
import { useRouter } from "next/navigation";

type ProductCardMode = "default" | "cart" | "admin";

type ProductCardProps = {
  mode?: ProductCardMode;
  product: ProductType;
  routerPush?: string;

  onAdd?: (product: ProductType, quantity: number) => void;
  onRemove?: (id: number) => void;
  onDelete?: (id: number) => void;

  priority?: boolean;

  onDeleteAdmin?: (id: number) => void;

  quantity?: number;
};

const ProductCard = ({
  mode = "default",
  product,
  onAdd,
  onDelete,
  onRemove,
  priority,
  routerPush,

  onDeleteAdmin,
  quantity = 0,
}: ProductCardProps) => {
  const [added, setAdded] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const handleAdd = () => {
    onAdd?.(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const handleDelete = async (id: number) => {
    await deleteProductAndRecipe(id);
    onDeleteAdmin?.(id);
    setMenuOpen(false);
  };

  return (
    <div
      className="relative w-full flex justify-between bg-[var(--color-card)] py-3 px-2 rounded-xl items-center shadow-[var(--shadow-md)]"
      onClick={() => routerPush && router.push(`${routerPush}/${product.slug}`)}
    >
      <div className=" w-full flex items-center">
        <div className="w-[80px] self-stretch relative rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="200px"
            className="object-cover"
            priority={priority}
          />
        </div>
        <div className="px-2 flex flex-col gap-2 ml-2">
          <div>
            <h3 className="font-bold text-xl">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-xl font-bold">${product.price}</p>
          </div>
        </div>
      </div>
      <div className="mr-2">
        {mode === "cart" && (
          <>
            <div className="absolute top-3 right-3">
              <button
                className="rounded-lg text-3xl p-2 font-bold text-[var(--color-primary)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(product.id);
                }}
              >
                <Trash />
              </button>
            </div>
            <div className="absolute right-2 bottom-2 flex flex-col justify-center gap-2">
              <div className="bottom-2 flex items-center gap-1">
                <button
                  className="rounded-lg text-3xl p-2 font-bold text-[var(--color-primary)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(product.id);
                  }}
                >
                  <Minus />
                </button>
                <p className="text-xl font-semibold">{quantity}</p>
                <button
                  className="rounded-lg text-3xl p-2 font-bold text-[var(--color-primary)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd?.(product, 1);
                  }}
                >
                  <Plus />
                </button>
              </div>
            </div>
          </>
        )}{" "}
        {mode === "default" && (
          <button
            className="text-3xl p-2 font-bold text-[var(--color-primary)] relative w-10 h-10"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out
      ${added ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"}`}
            >
              <Plus />
            </span>

            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out text-green-500
      ${added ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"}`}
            >
              <Check />
            </span>
          </button>
        )}
        {mode === "admin" && (
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
                  }}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
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
                  }}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
