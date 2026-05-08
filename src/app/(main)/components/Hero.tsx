import Image from "next/image";
import React from "react";
import Button from "./Button";
import LinkComponent from "./LinkComponent";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative w-full min-h-[520px] flex items-end">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/bread.jpg"
          alt="Panadería integral"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay: más opaco abajo, semitransparente arriba */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(80,55,30,0.92) 0%, rgba(80,55,30,0.55) 50%, rgba(80,55,30,0.15) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-12 pt-32 flex flex-col items-start max-w-lg">
        {/* Badge artesanal */}
        <span
          className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,220,150,0.35)",
            color: "#f5d9a0",
            letterSpacing: "0.12em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#f5d9a0",
            }}
          />
          Hecho a mano · Sin conservantes
        </span>

        {/* Headline */}
        <h1
          className="text-white font-bold leading-tight mb-4"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2rem, 6vw, 3rem)",
            textShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}
        >
          Panadería artesanal,
          <br />
          <span style={{ color: "#f5d9a0" }}>saludable e integral.</span>
        </h1>

        {/* Línea decorativa dorada */}
        <div
          className="mb-5"
          style={{
            width: 48,
            height: 2,
            background: "linear-gradient(to right, #f5d9a0, transparent)",
            borderRadius: 2,
          }}
        />

        {/* Subtítulo */}
        <p
          className="mb-8 leading-relaxed"
          style={{
            color: "rgba(255,240,210,0.85)",
            fontSize: "1.05rem",
            textShadow: "0 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          Ingredientes reales, recetas caseras
  <br />y sabor auténtico en cada bocado.
        </p>

        {/* CTA */}
        <Link
          href="/productos"
          className="flex items-center gap-3 px-7 py-3 rounded-sm font-semibold transition-all duration-200"
          style={{
            background: "#f5d9a0",
            color: "#3a1e08",
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
          }}
        >
            <p>Ver productos</p>
            <MoveRight />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
