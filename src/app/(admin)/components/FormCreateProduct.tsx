"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Input from "../../(main)/components/Input";
import { useState } from "react";
import Button from "../../(main)/components/Button";
import FormCreateRecipe from "./FormCreateRecipe";
import BackButton from "../../(main)/components/BackButton";
import { ProductType } from "../../types/product.type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash, X } from "lucide-react";
import { deleteProductImageById } from "@/src/lib/products";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener minúsculas, números y guiones",
    ),
  description: z.string().trim().optional().or(z.literal("")),
  price: z.number().min(0, "El precio no puede ser negativo"),
  isActive: z.boolean(),
  stock: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

type FormCreateProductProps = {
  productToEdit?: ProductType;
  onSuccess?: () => void;
};

type ProductFormType = z.infer<typeof productSchema>;

const FormCreateProduct = ({
  productToEdit,
  onSuccess,
}: FormCreateProductProps) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(
    productToEdit?.images ?? [],
  );

  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProductFormType, unknown, ProductFormType>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: productToEdit
      ? {
          name: productToEdit.name,
          price: productToEdit.price,
          // stock: productToEdit.stock,
          isActive: productToEdit.isActive,
          description: productToEdit.description,
        }
      : {
          isActive: true,
        },
  });

  const onSubmit = async (data: ProductFormType) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      // formData.append("stock", String(data.stock));
      formData.append("isActive", String(data.isActive));
      imagesFile.forEach((file) => {
        formData.append("images", file);
      });
      const res = await fetch(
        productToEdit ? `/api/products/${productToEdit.id}` : "/api/products",
        {
          method: productToEdit ? "PATCH" : "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        setErrorMessage(
          productToEdit
            ? "Error al editar el producto"
            : "Error al crear el producto",
        );
        return;
      }
      if (productToEdit) {
        setSuccessMessage("Producto editado");
        reset();
        setTimeout(() => {
          router.push("/admin/productos");
        }, 1000);
        return;
      }

      const product = await res.json();
      setCreatedProductId(product.id);
      setSuccessMessage("Producto creado, ahora cargá la receta");
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProductImage = async (imageId: number, slug: string) => {
    await deleteProductImageById(imageId, slug)
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
  }
  console.log(productToEdit);

  return (
    <>
      {!createdProductId ? (
        <>
          <div className="flex items-center gap-2 mb-6">
            <BackButton />
            <h3 className="text-xl font-bold">
              {productToEdit ? "Editar Producto" : "Crear producto"}
            </h3>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
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
              error={errors.name?.message}
            />
            <Input
              type="text"
              placeholder="Precio"
              name="price"
              registerOptions={{ valueAsNumber: true }}
              register={register}
              error={errors.price?.message}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImagesFile(Array.from(e.target.files || []))}
              className="w-full bg-white border rounded-sm px-2 py-2 outline-none border-[var(--color-primary)]/60"
            />

            {productToEdit && existingImages && (
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <button
                      type="button"
                      className="absolute bg-red-600 text-white rounded top-2 right-2"
                      onClick={() => handleDeleteProductImage(image.id, productToEdit.slug)}
                    >
                      <X size={20} />
                    </button>
                    <Image
                      src={image.url}
                      alt={productToEdit.name}
                      width={120}
                      height={120}
                      className="object-cover rounded-md"
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
            {/*          <Input
              type="text"
              name="stock"
              placeholder="Stock"
              registerOptions={{ valueAsNumber: true }}
              register={register}
              error={errors.stock?.message}
            /> */}
            <Button type="submit" text={productToEdit ? "Listo" : "Crear"} />
            {errorMessage && (
              <p className="text-red-500 font-medium text-center px-4">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-green-600 font-medium text-center px-4">
                {successMessage}
              </p>
            )}
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            <BackButton />
            <h3 className="text-xl font-bold">Crear receta</h3>
          </div>
          <FormCreateRecipe productId={createdProductId} />
        </>
      )}
    </>
  );
};

export default FormCreateProduct;
