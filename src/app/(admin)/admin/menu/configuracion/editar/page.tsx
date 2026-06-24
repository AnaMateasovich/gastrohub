import FormConfigure from "@/src/app/(admin)/components/FormConfigure";
import BackButton from "@/src/app/(main)/components/BackButton";
import { StoreSettingsType } from "@/src/app/types/storeSettings";
import { getSettings } from "@/src/lib/settings";
import React, { Suspense } from "react";

const page = () => {
  return (
    <section className="mx-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-bold">Editar configuración</h1>
      </div>
      <Suspense
        fallback={
          <p className="mt-4 text-[var(--color-text-secondary)]">
            Cargando configuración...
          </p>
        }
      >
        <EditSettingsSection />
      </Suspense>
    </section>
  );
};

const EditSettingsSection = async () => {
  const config: StoreSettingsType | null = await getSettings();
  return <FormConfigure settingsToEdit={config} />;
};

export default page;