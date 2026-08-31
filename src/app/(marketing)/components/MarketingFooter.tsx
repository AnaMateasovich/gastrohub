'use client'
import Link from "next/link";

const MarketingFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--gh-ink)", color: "var(--gh-paper)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            GastroHub
          </p>
          <p className="text-sm opacity-70 leading-relaxed">
            El software para administrar tu panadería, resto o negocio
            gastronómico — pedidos, productos y gastos, todo en un lugar.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold opacity-90 mb-1">Producto</p>
          <Link href="/precios" className="opacity-70 hover:opacity-100 transition-opacity">
            Precios
          </Link>
          <Link href="/register" className="opacity-70 hover:opacity-100 transition-opacity">
            Crear cuenta
          </Link>
          <Link href="/login" className="opacity-70 hover:opacity-100 transition-opacity">
            Ingresar
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold opacity-90 mb-1">Contacto</p>
          <a
            href="mailto:hola@gastrohub.com"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            hola@gastrohub.com
          </a>
        </div>
      </div>

      <div
        className="text-center text-xs py-4 opacity-50"
        style={{ borderTop: "1px solid rgba(246,241,231,0.15)" }}
      >
        © {year} GastroHub
      </div>
    </footer>
  );
};

export default MarketingFooter;