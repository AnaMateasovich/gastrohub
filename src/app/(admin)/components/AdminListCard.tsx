"use client";
import React, { useState } from "react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  emphasis?: boolean; // para el valor "grande" tipo precio total
};

type AdminListCardProps<T extends { id: number | string }> = {
  item: T;
  title: (item: T) => React.ReactNode;
  badge?: (item: T) => React.ReactNode; // ej: unidad, categoría
  fields: FieldConfig<T>[]; // se pintan en el footer, separados por border-t
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onClick?: (item: T) => void;
  testId?: string; // ej: "recipe" -> data-testid="recipe-card-{title}"
};

function AdminListCard<T extends { id: number | string }>({
  item,
  title,
  badge,
  fields,
  onEdit,
  onDelete,
  onClick,
  testId = "item",
}: AdminListCardProps<T>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const label = String(title(item));

  return (
    <div
      data-testid={`${testId}-card-${label}`}
      onClick={() => onClick?.(item)}
      className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 flex flex-col gap-3 shadow-[var(--shadow-sm)] ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <h5 className="font-bold text-base text-[var(--color-text-primary)]">
          {title(item)}
        </h5>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-natural-bg)] text-[var(--color-primary-dark)]">
              {badge(item)}
            </span>
          )}

          {(onEdit || onDelete) && (
            <div className="relative">
              <button
                data-testid={`btn-options-${label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <EllipsisVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 bg-[var(--color-surface)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] z-50 flex flex-col min-w-[130px] border border-[var(--color-border)]">
                  {onEdit && (
                    <button
                      data-testid={`btn-edit-${label}`}
                      className="px-4 py-2 text-left hover:bg-[var(--color-natural-bg)] text-sm flex items-center gap-2 text-[var(--color-text-primary)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                        setMenuOpen(false);
                      }}
                    >
                      <Pencil size={14} /> Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      data-testid={`btn-delete-${label}`}
                      className="px-4 py-2 text-left hover:bg-[var(--color-natural-bg)] text-sm flex items-center gap-2 text-[var(--color-error)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                        setMenuOpen(false);
                      }}
                    >
                      <Trash size={14} /> Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-2">
        {fields.map((f) => (
          <div key={String(f.key)} className={f.emphasis ? "text-right" : ""}>
            <p className="text-xs text-[var(--color-text-secondary)] m-0">
              {f.label}
            </p>
            <p
              data-testid={`${testId}-${String(f.key)}-${label}`}
              className={`m-0 text-[var(--color-text-primary)] ${
                f.emphasis
                  ? "bg-[var(--color-natural-bg)] py-2 px-4 rounded-[var(--radius-sm)] font-bold inline-block"
                  : "text-base font-medium"
              }`}
            >
              {f.render ? f.render(item) : String(item[f.key])}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminListCard;