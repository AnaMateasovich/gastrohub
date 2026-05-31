import LoginComponent from "@/src/app/(main)/components/LoginComponent";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex-shrink-0">
      <Image
        src="/hero.jpg"
        alt="Bread"
        fill
        sizes="500px"
        priority
        className="absolute inset-0 z-0 pt-2 pb-28 image-cover blur-sm"
      />
      <div className="absolute bg-black/30 inset-0 z-10 h-screen pt-2 pb-28 image-cover blur-sm"></div>
      <div className="absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2 flex flex-col gap-6 w-full px-4 z-20">
        <h4 className="text-2xl font-bold text-center text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">Iniciar sesión</h4>
        <LoginComponent />
      <p className="text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] text-center">¿No tienes una cuenta?, <Link href="/register" ><strong>¡Registrate!</strong></Link></p>
      </div>
    </section>
  );
};

export default page;
