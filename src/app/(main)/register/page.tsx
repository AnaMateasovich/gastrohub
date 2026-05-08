import RegisterComponent from "@/src/app/(main)/components/RegisterComponent";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <section className="relative h-screen w-full">
      <Image
        src="/bread.jpg"
        alt="Bread"
        fill
        sizes="500px"
        priority
        className="absolute inset-0 z-0 h-screen pb-28 image-cover blur-sm"
      />
      <div className="absolute bg-black/30 inset-0 z-10 h-screen pt-2 pb-28 image-cover blur-sm"></div>
      <div className="absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2 flex flex-col gap-6 w-full px-4 z-20">
        <h4 className="text-2xl font-bold text-center text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
          Crear cuenta
        </h4>
        <RegisterComponent />
      </div>
    </section>
  );
};

export default page;
