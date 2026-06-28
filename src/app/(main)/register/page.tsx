import RegisterComponent from "@/src/app/(main)/components/RegisterComponent";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/hero.jpg"
        alt="Pan recién horneado"
        fill
        sizes="100vw"
        priority
        className="absolute inset-0 z-0 object-cover blur-sm"
      />
      <div className="absolute bg-black/40 inset-0 z-10" />

      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 overflow-y-auto py-10">
        <div className="w-full max-w-[420px] flex flex-col gap-6 md:bg-white/95 md:backdrop-blur-sm md:rounded-3xl md:shadow-2xl md:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold italic text-white md:text-[var(--color-primary-dark)] [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] md:[text-shadow:none]">
              Sabores Naturales
            </h1>
            <h4 className="text-lg mt-1 text-white md:text-gray-500 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] md:[text-shadow:none]">
              Creá tu cuenta para empezar a pedir
            </h4>
          </div>

          <RegisterComponent />

          <p className="text-white md:text-gray-500 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] md:[text-shadow:none] text-center text-sm">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="font-bold md:text-[var(--color-primary-dark)] md:font-medium">
              Ingresá
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default page;
