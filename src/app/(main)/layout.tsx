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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sabores Naturales",
    template: "%s | Sabores Naturales",
  },
  description:
    "Plataforma multitenant para gestionar panaderías, rotiserías y negocios gastronómicos. Administración de productos, pedidos, clientes, recetas, stock y ventas desde un solo lugar.",
  keywords: [
    "Sabores Naturales",
    "multitenant",
    "panadería",
    "rotisería",
    "gastronomía",
    "ecommerce",
    "pedidos online",
    "gestión de negocios",
    "Next.js",
  ],
  authors: [{ name: "Ana Mateasovich" }],
  creator: "Ana Mateasovich",
  applicationName: "Sabores Naturales",
  metadataBase: new URL("https://saboresnaturales.app"), // Cambiá por tu dominio
  openGraph: {
    title: "Sabores Naturales",
    description:
      "Gestioná tu negocio gastronómico con una plataforma moderna y multitenant.",
    type: "website",
    locale: "es_AR",
    siteName: "Sabores Naturales",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabores Naturales",
    description:
      "Plataforma multitenant para la gestión de negocios gastronómicos.",
  },
};

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const settings:StoreSettingsType = await getSettings();
  return (
    <main className="min-h-full flex flex-col">
      <Suspense fallback={null}>
        <Providers>
          <Header logo={settings.organizationName}/>
          <main className="flex-1 w-full max-w-[1400px] mx-auto pt-[60px] md:pt-[70px] pb-[70px] md:pb-0">
            {children}
          </main>
          <Nav />
        </Providers>
        <Footer />
      </Suspense>
    </main>
  );
}
