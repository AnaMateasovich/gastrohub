import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "./components/Header";
import Nav from "./components/Nav";

import { Suspense } from "react";
import Providers from "../providers";
import Footer from "./components/Footer";
import { getSettings } from "@/src/lib/settings";
import { StoreSettingsType } from "../types/storeSettings";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import StoreConfigAlert from "./components/StoreConfigAlert";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const tenantSlug = headersList.get("x-tenant-slug");
  const userRole = headersList.get("x-user-role");
  const userOrgId = headersList.get("x-user-org-id");
  const organization = await prisma.organization.findUnique({
    where: { slug: tenantSlug ?? "" },
  });

  const isOwnerViewing =
    !!userOrgId &&
    !!organization &&
    organization.id === userOrgId &&
    (userRole === "ADMIN" || userRole === "OWNER");

  const settings: StoreSettingsType = await getSettings();
  console.log(settings)
  return (
    <main className="min-h-full flex flex-col">
      <Suspense fallback={null}>
        <Providers>
          <StoreConfigAlert
            settings={settings}
            isOwnerViewing={isOwnerViewing}
          />
          <Header
            logo={settings?.organizationName ?? "Gastrohub"}
            configAlert={
              <StoreConfigAlert
                settings={settings}
                isOwnerViewing={isOwnerViewing}
              />
            }
          />
          <main className="flex-1 w-full max-w-[1400px] mx-auto pt-[60px] md:pt-[70px] pb-[70px] md:pb-0">
            {children}
          </main>
          <Nav />
        </Providers>
        <Footer
          organizationName={settings?.organizationName}
          storeDescription={settings?.storeDescription}
          city={settings?.city}
          province={settings?.province}
          instagramUrl={settings?.instagramUrl}
          whatsappNumber={settings?.whatsappPhone}
          openingTime={settings?.openingTime}
          closingTime={settings?.closingTime}
        />
      </Suspense>
    </main>
  );
}
