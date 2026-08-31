"use client";
import { storeSettingsSchema } from "@/src/lib/validations/configure.schema";
import z from "zod";
import {
  StoreSettingsInput,
  StoreSettingsType,
} from "../../../types/storeSettings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../(main)/components/Input";
import Button from "../../../(main)/components/Button";
import {
  createStoreSettings,
  updateStoreSettings,
} from "@/src/lib/actions/setting.action";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export type StoreSettingsFormType = z.infer<typeof storeSettingsSchema>;

type FormConfigureProps = {
  settingsToEdit?: StoreSettingsInput | null;
};

const FormConfigure = ({ settingsToEdit }: FormConfigureProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<StoreSettingsFormType>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: settingsToEdit
      ? {
          organizationName: settingsToEdit.organizationName ?? "",
          storeDescription: settingsToEdit.storeDescription ?? "",
          heroImageUrl: settingsToEdit.heroImageUrl ?? "",
          heroBadgeText: settingsToEdit.heroBadgeText ?? "",
          heroTitle: settingsToEdit.heroTitle ?? "",
          heroHighlight: settingsToEdit.heroHighlight ?? "",
          heroSubtitle: settingsToEdit.heroSubtitle ?? "",
          ctaLabel: settingsToEdit.ctaLabel ?? "",
          deliveryFee: Number(settingsToEdit.deliveryFee),
          freeDeliveryFrom: settingsToEdit.freeDeliveryFrom
            ? Number(settingsToEdit.freeDeliveryFrom)
            : undefined,
          minimumOrderAmount: settingsToEdit.minimumOrderAmount
            ? Number(settingsToEdit.minimumOrderAmount)
            : undefined,
          storeOpen: settingsToEdit.storeOpen,
          openingTime: settingsToEdit.openingTime ?? "",
          closingTime: settingsToEdit.closingTime ?? "",
          whatsappPhone: settingsToEdit.whatsappPhone ?? "",
          storeEmail: settingsToEdit.storeEmail ?? "",
          instagramUrl: settingsToEdit.instagramUrl ?? "",
          city: settingsToEdit.city ?? "",
          province: settingsToEdit.province ?? "",
          address: settingsToEdit.address ?? "",
          allowGuestCheckout: settingsToEdit.allowGuestCheckout,
          enableCoupons: settingsToEdit.enableCoupons,
          maxDiscountPercentage:
            settingsToEdit.maxDiscountPercentage ?? undefined,
          announcementBar: settingsToEdit.announcementBar ?? "",
          maintenanceMode: settingsToEdit.maintenanceMode,
        }
      : {
          deliveryFee: 0,
          storeOpen: true,
          allowGuestCheckout: true,
          enableCoupons: true,
          maintenanceMode: false,
        },
  });

  // Imagen del hero
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(
    settingsToEdit?.heroImageUrl ?? null,
  );
  const [heroImageError, setHeroImageError] = useState("");
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImageFile(file);
    setHeroImageError("");
    setHeroImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveHeroImage = () => {
    setHeroImageFile(null);
    setHeroImagePreview(null);
  };

  const uploadHeroImage = async (): Promise<string | undefined> => {
    if (!heroImageFile) return settingsToEdit?.heroImageUrl ?? undefined;

    const fd = new FormData();
    fd.append("image", heroImageFile);

    const res = await fetch("/api/images", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Error al subir la imagen");
    }

    const { url } = await res.json();
    return url;
  };

  const onSubmit = async (data: StoreSettingsFormType) => {
    try {
      setIsUploadingHero(true);
      const heroImageUrl = await uploadHeroImage();

      const payload = { ...data, heroImageUrl };

      if (settingsToEdit) {
        await updateStoreSettings(payload);
      } else {
        await createStoreSettings(payload);
      }
      toast.success("Configuración guardada");
    } catch {
      toast.error("Hubo un error al guardar la configuración");
    } finally {
      setIsUploadingHero(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 mt-4"
    >
      <h2 className="font-semibold text-lg mt-2">Personalización de Landing</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-[var(--color-text-secondary)]">
          Imagen de portada
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleHeroImageChange}
          className={`w-full bg-white border rounded-sm px-2 py-2 outline-none ${
            heroImageError
              ? "border-red-500"
              : "border-[var(--color-primary)]/60"
          }`}
        />
        {heroImageError && <div className="text-red-600">{heroImageError}</div>}

        {heroImagePreview && (
          <div className="relative w-fit">
            <button
              type="button"
              className="absolute bg-red-600 text-white rounded top-2 right-2"
              onClick={handleRemoveHeroImage}
            >
              <X size={20} />
            </button>
            <Image
              src={heroImagePreview}
              alt="Portada"
              width={280}
              height={150}
              className="object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <Input
        type="text"
        name="organizationName"
        register={register}
        placeholder="Nombre de la tienda"
        error={errors.organizationName?.message}
      />

      <Input
        type="text"
        name="storeDescription"
        register={register}
        placeholder="Descripción de la tienda"
        error={errors.storeDescription?.message}
      />

      <Input
        type="text"
        name="heroBadgeText"
        register={register}
        placeholder="Texto del badge (ej: Hecho a mano)"
        error={errors.heroBadgeText?.message}
      />
      <Input
        type="text"
        name="heroTitle"
        register={register}
        placeholder="Título principal"
        error={errors.heroTitle?.message}
      />
      <Input
        type="text"
        name="heroHighlight"
        register={register}
        placeholder="Frase destacada (segunda línea, color acento)"
        error={errors.heroHighlight?.message}
      />
      <Input
        type="text"
        name="heroSubtitle"
        register={register}
        placeholder="Subtítulo"
        error={errors.heroSubtitle?.message}
      />
      <Input
        type="text"
        name="ctaLabel"
        register={register}
        placeholder="Texto del botón (ej: Ver productos)"
        error={errors.ctaLabel?.message}
      />
      <h2 className="font-semibold text-lg mt-2">Envíos</h2>
      <Input
        type="number"
        name="deliveryFee"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        placeholder="Costo de envío"
        error={errors.deliveryFee?.message}
      />
      <Input
        type="number"
        name="freeDeliveryFrom"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        placeholder="Envío gratis a partir de"
        error={errors.freeDeliveryFrom?.message}
      />
      <Input
        type="number"
        name="minimumOrderAmount"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        placeholder="Monto mínimo de compra"
        error={errors.minimumOrderAmount?.message}
      />

      <h2 className="font-semibold text-lg mt-2">Horarios y estado</h2>
      <div className="flex items-center justify-between bg-white border rounded-sm px-2 py-2 border-[var(--color-primary)]/60">
        <label htmlFor="storeOpen">Tienda abierta</label>
        <input type="checkbox" id="storeOpen" {...register("storeOpen")} />
      </div>
      <Input
        type="text"
        name="openingTime"
        register={register}
        placeholder="Hora de apertura (ej: 09:00)"
        error={errors.openingTime?.message}
      />
      <Input
        type="text"
        name="closingTime"
        register={register}
        placeholder="Hora de cierre (ej: 20:00)"
        error={errors.closingTime?.message}
      />
      <div className="flex items-center justify-between bg-white border rounded-sm px-2 py-2 border-[var(--color-primary)]/60">
        <label htmlFor="maintenanceMode">Modo mantenimiento</label>
        <input
          type="checkbox"
          id="maintenanceMode"
          {...register("maintenanceMode")}
        />
      </div>

      <h2 className="font-semibold text-lg mt-2">Contacto</h2>
      <Input
        type="text"
        name="whatsappPhone"
        register={register}
        placeholder="WhatsApp"
        error={errors.whatsappPhone?.message}
      />
      <Input
        type="email"
        name="storeEmail"
        register={register}
        placeholder="Email de la tienda"
        error={errors.storeEmail?.message}
      />
      <Input
        type="text"
        name="instagramUrl"
        register={register}
        placeholder="Instagram (url)"
        error={errors.instagramUrl?.message}
      />
      <h2 className="font-semibold text-lg mt-2">Ubicación</h2>

      <Input
        type="text"
        name="city"
        register={register}
        placeholder="Ciudad"
        error={errors.city?.message}
      />

      <Input
        type="text"
        name="province"
        register={register}
        placeholder="Provincia"
        error={errors.province?.message}
      />

      <Input
        type="text"
        name="address"
        register={register}
        placeholder="Dirección"
        error={errors.address?.message}
      />
      <h2 className="font-semibold text-lg mt-2">Pedidos y cupones</h2>
      <div className="flex items-center justify-between bg-white border rounded-sm px-2 py-2 border-[var(--color-primary)]/60">
        <label htmlFor="allowGuestCheckout">Permitir compra sin registro</label>
        <input
          type="checkbox"
          id="allowGuestCheckout"
          {...register("allowGuestCheckout")}
        />
      </div>
      <div className="flex items-center justify-between bg-white border rounded-sm px-2 py-2 border-[var(--color-primary)]/60">
        <label htmlFor="enableCoupons">Habilitar cupones</label>
        <input
          type="checkbox"
          id="enableCoupons"
          {...register("enableCoupons")}
        />
      </div>
      <Input
        type="number"
        name="maxDiscountPercentage"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        placeholder="Descuento máximo (%)"
        error={errors.maxDiscountPercentage?.message}
      />

      <h2 className="font-semibold text-lg mt-2">Anuncios</h2>
      <Input
        type="text"
        name="announcementBar"
        register={register}
        placeholder="Barra de anuncio (ej: Envío gratis hoy!)"
        error={errors.announcementBar?.message}
      />

      <div className="mt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          text={isSubmitting ? "Guardando..." : "Guardar configuración"}
        />
      </div>
    </form>
  );
};

export default FormConfigure;
