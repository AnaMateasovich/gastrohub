"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XlsFormFiller } from "./XlsFormFiller";
import Input from "@/src/app/(main)/components/Input";
import { Ingredient } from "@/src/app/types/ingredient.type";
import Button from "@/src/app/(main)/components/Button";

const ingredientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  unit: z.string().min(1, "La unidad es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  stock: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

type IngredientFormType = z.infer<typeof ingredientSchema>;

type XlsRow = {
  data: Partial<IngredientFormType>;
  errors: string[];
};

type CreateIngredientFormProps = {
  ingredientToEdit?: Ingredient;
};

const CreateIngredientForm = ({
  ingredientToEdit,
}: CreateIngredientFormProps) => {
  const [createAndContinue, setCreateAndContinue] = useState(false);
  const [xlsRows, setXlsRows] = useState<XlsRow[]>([]);
  const [xlsIndex, setXlsIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IngredientFormType>({
    resolver: zodResolver(ingredientSchema),
    mode: "onChange",
    defaultValues: ingredientToEdit
      ? {
          name: ingredientToEdit.name,
          price: ingredientToEdit.price,
          unit: ingredientToEdit.unit,
          stock: ingredientToEdit.stock ?? undefined,
        }
      : {
          unit: "kg",
        },
  });

  const loadRowIntoForm = useCallback(
    (rows: XlsRow[], index: number) => {
      const row = rows[index];
      (Object.entries(row.data) as [keyof IngredientFormType, any][]).forEach(
        ([key, value]) => {
          setValue(key, value, { shouldValidate: true });
        },
      );
    },
    [setValue],
  );

  const handleRowParsed = useCallback(
    (data: Partial<IngredientFormType>, rowIndex: number, errors: string[]) => {
      setXlsRows((prev) => {
        const next = [...prev, { data, errors }];
        if (rowIndex === 0) loadRowIntoForm(next, 0);
        return next;
      });
    },
    [loadRowIntoForm],
  );

  const onSubmit = async (data: IngredientFormType) => {
    try {
      const res = await fetch(
        ingredientToEdit
          ? `/api/ingredients/${ingredientToEdit.id}`
          : "/api/ingredients",
        {
          method: ingredientToEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            unit: data.unit,
            price: data.price,
            ...(data.stock !== undefined &&
              !Number.isNaN(data.stock) && { stock: data.stock }),
            ...(ingredientToEdit && { id: ingredientToEdit.id }),
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Error al crear el ingrediente");
      }
      toast.success(
        ingredientToEdit ? "Ingrediente actualizado" : "Ingrediente creado",
      );

      // Si hay filas del XLS, avanzar a la siguiente
      if (xlsRows.length > 0) {
        const nextIndex = xlsIndex + 1;
        if (nextIndex < xlsRows.length) {
          setXlsIndex(nextIndex);
          loadRowIntoForm(xlsRows, nextIndex);
        } else {
          // Terminó todas las filas
          toast.success(`Se crearon ${xlsRows.length} ingredientes`);
          setXlsRows([]);
          setXlsIndex(0);
          reset({ unit: "kg" });
          router.push("/admin/insumos");
        }
        return;
      }

      reset();
      if (!createAndContinue) {
        router.push(`/admin/insumos`);
      }
    } catch (error) {
      toast.error("Hubo un error al crear el ingrediente");
    }
  };

  const handleSkip = () => {
  const nextIndex = xlsIndex + 1;
  if (nextIndex < xlsRows.length) {
    setXlsIndex(nextIndex);
    loadRowIntoForm(xlsRows, nextIndex);
  } else {
    toast.success(`Importación finalizada`);
    setXlsRows([]);
    setXlsIndex(0);
    reset({ unit: "kg" });
    router.push("/admin/insumos");
  }
};


  const isXlsMode = xlsRows.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Uploader — solo si no hay ingredientToEdit y no hay filas cargadas */}
      {!ingredientToEdit && !isXlsMode && (
        <XlsFormFiller
          schema={ingredientSchema}
          onRowParsed={handleRowParsed}
          columnMap={{
            Nombre: "name",
            Ingrediente: "name",

            Unidad: "unit",

            Precio: "price",
            Costo: "price",

            StockActual: "stock",
            Existencia: "stock",
          }}
        />
      )}

      {/* Progreso XLS */}
      {isXlsMode && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Ingrediente {xlsIndex + 1} de {xlsRows.length}
          </span>
          
          <button
            type="button"
            className="text-red-400 hover:text-red-600"
            onClick={() => {
              setXlsRows([]);
              setXlsIndex(0);
              reset({ unit: "kg" });
            }}
          >
            Cancelar importación
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          type="text"
          name="name"
          register={register}
          placeholder="Nombre"
          error={errors.name?.message}
        />
        <Input
          type="text"
          name="price"
          register={register}
          registerOptions={{ valueAsNumber: true }}
          placeholder="Precio"
          error={errors.price?.message}
        />
        <div
          className={`flex w-full bg-white border rounded-sm justify-between px-2 py-2 outline-none ${
            errors.unit ? "border-red-500" : "border-[var(--color-primary)]/60"
          } `}
        >
          <label htmlFor="">Unidad</label>
          <select {...register("unit")}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">litro</option>
            <option value="ml">ml</option>
            <option value="u">unidad</option>
          </select>
        </div>
        <Input
          type="number"
          name="stock"
          register={register}
          registerOptions={{ valueAsNumber: true }}
          placeholder="Stock"
          error={errors.stock?.message}
        />
        <div className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            text={
              isSubmitting
                ? ingredientToEdit
                  ? "Editando..."
                  : "Creando..."
                : ingredientToEdit
                  ? "Editar"
                  : "Crear"
            }
            onClick={() => setCreateAndContinue(false)}
          />
        </div>
        {!ingredientToEdit && !isXlsMode && mounted && (
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => setCreateAndContinue(true)}
            text={isSubmitting ? "Creando..." : "Guardar y crear otro"}
          />
        )}
        {isXlsMode && (
          <div className="">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSkip}
              text="Omitir"
              bgColor="bg-gray-700"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateIngredientForm;
