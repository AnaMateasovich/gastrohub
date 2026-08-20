"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Input from "../../../(main)/components/Input";
import { useState } from "react";
import Button from "../../../(main)/components/Button";
import BackButton from "../../../(main)/components/BackButton";
import { ProductType } from "../../../types/product.type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import {
  createProduct,
  deleteProductImageById,
  updateProduct,
  updateProductCost,
} from "@/src/lib/actions/products.actions";
import FormCreateRecipe from "./FormCreateRecipe";
import { CreateRecipeType } from "@/src/lib/validations/recipe.schema";
import { assignRecipeToProduct } from "@/src/lib/actions/recipe.action";
import { checkSlugAvailable } from "@/src/lib/products";
import { toast } from "sonner";

type RecipeSelectType = { id: number; name: string };
type CostType = "manual" | "recipe-existing" | "recipe-new";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener minúsculas, números y guiones",
    ),
  description: z.string().min(1, "La descripción es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  isActive: z.boolean(),
  saleUnit: z.string().min(1, "La unidad de venta es obligatoria"),
  saleAmount: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  extraCost: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

type ProductFormType = z.infer<typeof productSchema>;

type FormCreateProductProps = {
  productToEdit?: ProductType;
  recipes: RecipeSelectType[];
};

const FormCreateProduct = ({
  productToEdit,
  recipes,
}: FormCreateProductProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [productData, setProductData] = useState<{
    formData: ProductFormType;
    images: File[];
  } | null>(null);

  // Costo al crear
  const [costType, setCostType] = useState<CostType | null>(null);
  const [manualCostValue, setManualCostValue] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [recipeFormData, setRecipeFormData] = useState<CreateRecipeType | null>(
    null,
  );

  // Edición
  const [isChangingCost, setIsChangingCost] = useState(false);
  const [editCostType, setEditCostType] = useState<CostType | null>(null);
  const [editManualCost, setEditManualCost] = useState(
    productToEdit?.manualCost?.toString() ?? "",
  );
  const [editSelectedRecipeId, setEditSelectedRecipeId] = useState<
    number | null
  >(productToEdit?.recipeId ?? null);

  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState(
    productToEdit?.images ?? [],
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageError, setImageError] = useState("");

  const router = useRouter();

  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: productToEdit
      ? {
          name: productToEdit.name,
          price: productToEdit.price,
          slug: productToEdit.slug,
          isActive: productToEdit.isActive,
          description: productToEdit.description,
          saleUnit: productToEdit.saleUnit,
          saleAmount: productToEdit.saleAmount,
          extraCost: productToEdit.extraCost,
        }
      : {
          isActive: true,
        },
  });

  // Paso 1 → Paso 2 (solo crear)
  const handleNextStep = async (data: ProductFormType) => {
    const available = await checkSlugAvailable(data.slug);

    if (!available) {
      setError("slug", {
        type: "manual",
        message: "Este slug ya está en uso",
      });
      return;
    }
    if (existingImages.length === 0 && imagesFile.length === 0) {
      setImageError("La imagen es obligatoria");
      return;
    }
    setProductData({ formData: data, images: imagesFile });
    setStep(2);
  };

const uploadImages = async () => {
  const uploadedUrls: string[] = [];

  for (const file of imagesFile) {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/images", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Error al subir una imagen");
    }

    const { url } = await res.json();
    uploadedUrls.push(url);
  }

  return uploadedUrls;
};

  // Submit final al crear
  const handleCreate = async () => {
    if (!productData) return;
    if (!costType) return;
    if (costType === "manual" && !manualCostValue) return;
    if (costType === "recipe-existing" && !selectedRecipeId) return;
    if (costType === "recipe-new" && !recipeFormData) return;

    try {
      setIsUploading(true);

      const uploadedUrls = await uploadImages();

      const formData = new FormData();
      const { formData: data, images } = productData;

      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("saleAmount", String(data.saleAmount));
      formData.append("saleUnit", data.saleUnit);
      formData.append("extraCost", String(data.extraCost ?? 0));
      formData.append("isActive", String(data.isActive));
      uploadedUrls.forEach((url) => formData.append("imageUrls", url));

      if (costType === "manual") {
        formData.append("manualCost", manualCostValue);
      } else if (costType === "recipe-existing" && selectedRecipeId) {
        formData.append("recipeId", String(selectedRecipeId));
      } else if (costType === "recipe-new" && recipeFormData) {
        formData.append("recipeData", JSON.stringify(recipeFormData));
      }

      await createProduct(formData);
      toast.success("Producto creado");
      reset();
      setStep(1);
      router.push(`/admin/productos`);
    } catch (error) {
      toast.error("Error al crear el producto");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit al editar
  const handleEdit = async (data: ProductFormType) => {
    if (existingImages.length === 0 && imagesFile.length === 0) {
      setImageError("La imagen es obligatoria");
      return;
    }
    try {
      const uploadedUrls = await uploadImages();

      const formData = new FormData();
      formData.append("id", productToEdit!.id.toString());
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("saleAmount", String(data.saleAmount));
      formData.append("saleUnit", data.saleUnit);
      formData.append("extraCost", String(data.extraCost ?? 0));
      formData.append("isActive", String(data.isActive));
      uploadedUrls.forEach((url) => formData.append("imageUrls", url));

      if (imagesToDelete.length > 0) {
        await deleteProductImageById(imagesToDelete, productToEdit!.slug);
      }

      await updateProduct(formData);
      setIsChangingCost(false);

      // Si cambió el costo, actualizarlo
      if (isChangingCost && editCostType) {
        if (editCostType === "manual" && editManualCost) {
          await updateProductCost(productToEdit!.id, {
            type: "manual",
            value: Number(editManualCost),
          });
        } else if (editCostType === "recipe-existing" && editSelectedRecipeId) {
          await updateProductCost(productToEdit!.id, {
            type: "recipe",
            value: editSelectedRecipeId,
          });
        } else if (editCostType === "recipe-new" && recipeFormData) {
          // Para receta nueva al editar, la creamos y asignamos
          await assignRecipeToProduct(productToEdit!.id, 0); // placeholder
          // Acá necesitarías una action que cree la receta y devuelva el id
          // Por ahora lo dejamos con recipe-existing y recipe-new como casos separados
        }
      }

      toast.success("Producto editado con éxito");
      router.refresh();
      router.push("/admin/productos");
    } catch (error) {
      toast.error("Ocurrio un error al actualizar el producto");
      console.error(error);
    }
  };

  const handleDeleteProductImage = (imageId: number) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Qué costo tiene actualmente el producto al editar
  const currentCostLabel = () => {
    if (productToEdit?.manualCost)
      return `Costo manual: $${productToEdit.manualCost}`;
    if (productToEdit?.recipeId) {
      const recipe = recipes.find((r) => r.id === productToEdit.recipeId);
      return `Receta asignada: ${recipe?.name ?? "Desconocida"}`;
    }
    return "Sin costo asignado";
  };

  const formFields = (
    <>
      <Input
        type="text"
        name="name"
        placeholder="Nombre"
        register={register}
        error={errors.name?.message}
      />
      <Input
        type="text"
        name="description"
        placeholder="Descripción"
        register={register}
        error={errors.description?.message}
      />
      <Input
        type="text"
        name="slug"
        placeholder="Slug"
        register={register}
        error={errors.slug?.message}
      />
      <Input
        type="text"
        placeholder="Precio"
        name="price"
        registerOptions={{ valueAsNumber: true }}
        register={register}
        error={errors.price?.message}
      />
      <select
        {...register("saleUnit")}
        className={`w-full bg-white border rounded-sm px-2 py-2 outline-none ${errors.saleUnit ? "border-red-500" : "border-[var(--color-primary)]/60"}`}
      >
        <option value="">¿Cómo se vende?</option>
        <option value="u">Por unidad</option>
        <option value="kg">Por kg</option>
        <option value="g">Por gramos</option>
        <option value="porciones">Por porción</option>
      </select>
      {errors.saleUnit && (
        <p className="text-red-500">{errors.saleUnit.message}</p>
      )}
      <Input
        type="number"
        placeholder="Cantidad por unidad (ej: 0.5, 1, 6)"
        name="saleAmount"
        registerOptions={{ valueAsNumber: true }}
        register={register}
        error={errors.saleAmount?.message}
      />
      <Input
        type="number"
        placeholder="Costo extra (packaging, etiqueta, etc)"
        name="extraCost"
        registerOptions={{ valueAsNumber: true }}
        register={register}
        error={errors.extraCost?.message}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          setImagesFile(Array.from(e.target.files || []));
          setImageError("");
        }}
        className={`w-full bg-white border rounded-sm px-2 py-2 outline-none ${imageError && imagesFile.length === 0 ? "border-red-500" : "border-[var(--color-primary)]/60"}`}
      />
      {imageError && imagesFile.length === 0 && (
        <div className="text-red-600">{imageError}</div>
      )}
      {productToEdit && existingImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {existingImages.map((image) => (
            <div key={image.id} className="relative">
              <button
                type="button"
                className="absolute bg-red-600 text-white rounded top-2 right-2"
                onClick={() => handleDeleteProductImage(image.id)}
              >
                <X size={20} />
              </button>
              <Image
                src={image.url ?? "/no-image.png"}
                alt={productToEdit.name}
                width={100}
                height={120}
                className="object-cover h-[150px] rounded-md"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("isActive")}
          defaultChecked={productToEdit?.isActive ?? true}
          className="w-4 h-4"
        />
        <label className="text-sm text-[var(--color-text-secondary)]">
          Producto activo
        </label>
      </div>
    </>
  );

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <BackButton url={`/admin/productos`}/>
        <h3 className="text-xl font-bold">
          {productToEdit
            ? "Editar Producto"
            : step === 1
              ? "Crear producto"
              : "Costeo del producto"}
        </h3>
      </div>

      {/* ── CREAR ── */}
      {!productToEdit && (
        <>
          {step === 1 && (
            <form
              onSubmit={handleSubmit(handleNextStep)}
              className="flex flex-col gap-2"
              data-testid="product-form-step-1-crear"
            >
              {formFields}
              <Button type="submit" text="Siguiente →" />
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-left text-[var(--color-text-secondary)]"
              >
                ← Volver
              </button>

              {/* Radio cómo se costea */}
              <div className="flex flex-col gap-2">
                <p className="font-medium">¿Cómo se costea este producto?</p>
                {(
                  ["manual", "recipe-existing", "recipe-new"] as CostType[]
                ).map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 py-3 px-4 bg-white shadow-sm rounded-md cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="costType"
                      value={type}
                      checked={costType === type}
                      onChange={() => setCostType(type)}
                    />
                    {type === "manual" && "✏️ Costo manual"}
                    {type === "recipe-existing" && "📋 Elegir receta existente"}
                    {type === "recipe-new" && "➕ Crear receta nueva"}
                  </label>
                ))}
              </div>

              {/* Según elección */}
              {costType === "manual" && (
                <input
                  type="number"
                  placeholder="Costo del producto (ej: 400)"
                  value={manualCostValue}
                  onChange={(e) => setManualCostValue(e.target.value)}
                  className="w-full bg-white border rounded-sm px-2 py-2 outline-none border-[var(--color-primary)]/60"
                />
              )}

              {costType === "recipe-existing" && (
                <select
                  className="w-full bg-white border rounded-sm px-2 py-2 outline-none border-[var(--color-primary)]/60"
                  defaultValue=""
                  onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Seleccioná una receta
                  </option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              )}

              {costType === "recipe-new" && (
                <FormCreateRecipe
                  onRecipeReady={(data) => setRecipeFormData(data)}
                />
              )}

              {/* Botón crear final — no aparece si está completando la receta nueva */}
              {costType !== "recipe-new" && (
                <Button
                  type="button"
                  text={isSubmitting ? "Creando..." : "Crear"}
                  disabled={
                    isSubmitting ||
                    !costType ||
                    (costType === "manual" && !manualCostValue) ||
                    (costType === "recipe-existing" && !selectedRecipeId)
                  }
                  onClick={handleCreate}
                />
              )}

              {/* Si eligió receta nueva, el botón de crear lo maneja FormCreateRecipe con onRecipeReady + acá escuchamos */}
              {costType === "recipe-new" && recipeFormData && (
                <Button
                  type="button"
                  text={isSubmitting ? "Creando..." : "Crear"}
                  disabled={isSubmitting}
                  onClick={handleCreate}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* ── EDITAR ── */}
      {productToEdit && (
        <form
              data-testid="product-form-step-1-editar"

          onSubmit={handleSubmit(handleEdit)}
          className="flex flex-col gap-2"
        >
          {formFields}

          {/* Sección costo */}
          <div className="mt-4 p-4 bg-white rounded-md shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{currentCostLabel()}</p>
              {!isChangingCost && (
                <button
                  type="button"
                  onClick={() => setIsChangingCost(true)}
                  className="text-sm text-[var(--color-primary)] font-medium"
                >
                  Cambiar
                </button>
              )}
              {isChangingCost && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingCost(false);
                      setEditCostType(null);
                    }}
                    className="text-sm text-red-500 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Si está cambiando, muestra el radio */}
            {isChangingCost && (
              <>
                <div className="flex flex-col gap-2">
                  {(
                    ["manual", "recipe-existing", "recipe-new"] as CostType[]
                  ).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="editCostType"
                        value={type}
                        checked={editCostType === type}
                        onChange={() => setEditCostType(type)}
                      />
                      {type === "manual" && "✏️ Costo manual"}
                      {type === "recipe-existing" &&
                        "📋 Elegir receta existente"}
                      {type === "recipe-new" && "➕ Crear receta nueva"}
                    </label>
                  ))}
                </div>

                {editCostType === "manual" && (
                  <input
                    type="number"
                    placeholder="Costo del producto (ej: 400)"
                    value={editManualCost}
                    onChange={(e) => setEditManualCost(e.target.value)}
                    className="w-full bg-white border rounded-sm px-2 py-2 outline-none border-[var(--color-primary)]/60"
                  />
                )}

                {editCostType === "recipe-existing" && (
                  <select
                    className="w-full bg-white border rounded-sm px-2 py-2 outline-none border-[var(--color-primary)]/60"
                    defaultValue={productToEdit.recipeId ?? ""}
                    onChange={(e) =>
                      setEditSelectedRecipeId(Number(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      Seleccioná una receta
                    </option>
                    {recipes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}

                {editCostType === "recipe-new" && (
                  <FormCreateRecipe
                    onRecipeReady={(data) => setRecipeFormData(data)}
                  />
                )}
              </>
            )}
          </div>

          <Button
            type="submit"
            text={isSubmitting ? "Guardando..." : "Guardar cambios"}
            disabled={isSubmitting}
          />
        </form>
      )}
    </>
  );
};

export default FormCreateProduct;
