"use client"
import { storeSettingsSchema } from "@/src/lib/validations/configure.schema";
import z from "zod";
import { StoreSettingsInput, StoreSettingsType } from "../../types/storeSettings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../(main)/components/Input";
import Button from "../../(main)/components/Button";
import { createStoreSettings, updateStoreSettings } from "@/src/lib/actions/setting.action";
import { toast } from "sonner";

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

  const onSubmit = async (data: StoreSettingsFormType) => {
    try {
      if (settingsToEdit) {
        await updateStoreSettings(data);
      } else {
        await createStoreSettings(data)
      }
      toast.success("Configuración guardada");
    } catch {
      toast.error("Hubo un error al guardar la configuración");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 mt-4"
    >
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
