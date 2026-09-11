import { StoreSettingsType } from "@/src/app/types/storeSettings";
import { getSettings } from "@/src/lib/settings";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import SettingsGroup from "../../components/settings/SettingsGroup";
import SettingsRow from "../../components/settings/SettingsRow";
import BackButton from "@/src/app/(main)/components/BackButton";

const page = () => {
  return (
    <section>
      <div className="flex items-center gap-2">
        <BackButton url="/admin/menu" />
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      <Suspense>
        <SettingsSection />
      </Suspense>
    </section>
  );
};

const SettingsSection = async () => {
  const config: StoreSettingsType | null = await getSettings();

  if (!config) {
    return (
      <div className="mt-6 flex flex-col items-center text-center gap-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)]">
        <p className="text-[var(--color-text-primary)] font-medium">
          Todavía no configuraste tu tienda
        </p>

        <p className="text-sm text-[var(--color-text-secondary)]">
          Definí el costo de envío, horarios y métodos de contacto.
        </p>

        <Link
          href="/admin/configuracion/editar"
          className="bg-[var(--color-primary)] text-white py-2 px-4 rounded-md mt-1"
        >
          Crear configuración
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">

      <div className="flex justify-end">
        <Link
          href="/admin/configuracion/editar"
          className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium"
        >
          <Pencil size={16} />
          Editar
        </Link>
      </div>

      {/* Información de la tienda */}

      <SettingsGroup title="Información de la tienda">
        <SettingsRow
          label="Nombre"
          value={config.organizationName || "Sin configurar"}
        />

        <SettingsRow
          label="Descripción"
          value={config.storeDescription || "Sin configurar"}
        />
      </SettingsGroup>

      {/* Landing */}

      {(config.heroImageUrl ||
        config.heroBadgeText ||
        config.heroTitle ||
        config.heroHighlight ||
        config.heroSubtitle ||
        config.ctaLabel) && (
        <SettingsGroup title="Personalización de Landing">
          {config.heroImageUrl && (
            <SettingsRow
              label="Imagen de portada"
              value="Configurada"
              highlight="success"
            />
          )}

          <SettingsRow
            label="Badge"
            value={config.heroBadgeText || "Sin configurar"}
          />

          <SettingsRow
            label="Título"
            value={config.heroTitle || "Sin configurar"}
          />

          <SettingsRow
            label="Frase destacada"
            value={config.heroHighlight || "Sin configurar"}
          />

          <SettingsRow
            label="Subtítulo"
            value={config.heroSubtitle || "Sin configurar"}
          />

          <SettingsRow
            label="Texto del botón"
            value={config.ctaLabel || "Sin configurar"}
          />
        </SettingsGroup>
      )}

      {/* Envíos */}

      <SettingsGroup title="Envíos">
        <SettingsRow
          label="Costo de envío"
          value={`$${config.deliveryFee}`}
        />

        <SettingsRow
          label="Envío gratis desde"
          value={
            config.freeDeliveryFrom !== null &&
            config.freeDeliveryFrom !== undefined
              ? `$${config.freeDeliveryFrom}`
              : "Sin configurar"
          }
        />

        <SettingsRow
          label="Monto mínimo de compra"
          value={
            config.minimumOrderAmount !== null &&
            config.minimumOrderAmount !== undefined
              ? `$${config.minimumOrderAmount}`
              : "Sin configurar"
          }
        />
      </SettingsGroup>

      {/* Horarios */}

      <SettingsGroup title="Horarios y estado">
        <SettingsRow
          label="Tienda"
          value={config.storeOpen ? "Abierta" : "Cerrada"}
          highlight={config.storeOpen ? "success" : "danger"}
        />

        <SettingsRow
          label="Apertura"
          value={config.openingTime || "Sin configurar"}
        />

        <SettingsRow
          label="Cierre"
          value={config.closingTime || "Sin configurar"}
        />

        <SettingsRow
          label="Modo mantenimiento"
          value={config.maintenanceMode ? "Activado" : "Desactivado"}
          highlight={config.maintenanceMode ? "danger" : undefined}
        />
      </SettingsGroup>

      {/* Contacto */}

      <SettingsGroup title="Contacto">
        <SettingsRow
          label="WhatsApp"
          value={config.whatsappPhone || "Sin configurar"}
        />

        <SettingsRow
          label="Email"
          value={config.storeEmail || "Sin configurar"}
        />

        <SettingsRow
          label="Instagram"
          value={config.instagramUrl || "Sin configurar"}
        />
      </SettingsGroup>

      {/* Ubicación */}

      <SettingsGroup title="Ubicación">
        <SettingsRow
          label="Ciudad"
          value={config.city || "Sin configurar"}
        />

        <SettingsRow
          label="Provincia"
          value={config.province || "Sin configurar"}
        />

        <SettingsRow
          label="Dirección"
          value={config.address || "Sin configurar"}
        />
      </SettingsGroup>

      {/* Pedidos y cupones */}

      <SettingsGroup title="Pedidos y cupones">
        <SettingsRow
          label="Compra sin registro"
          value={
            config.allowGuestCheckout
              ? "Permitida"
              : "No permitida"
          }
        />

        <SettingsRow
          label="Cupones"
          value={
            config.enableCoupons
              ? "Habilitados"
              : "Deshabilitados"
          }
        />

        <SettingsRow
          label="Descuento máximo"
          value={
            config.maxDiscountPercentage !== null &&
            config.maxDiscountPercentage !== undefined
              ? `${config.maxDiscountPercentage}%`
              : "Sin configurar"
          }
        />
      </SettingsGroup>

      {/* Anuncios */}

      {config.announcementBar && (
        <SettingsGroup title="Anuncios">
          <SettingsRow
            label="Barra de anuncio"
            value={config.announcementBar}
          />
        </SettingsGroup>
      )}
    </div>
  );
};

export default page;