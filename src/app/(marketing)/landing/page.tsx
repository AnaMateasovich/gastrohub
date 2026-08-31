import Link from "next/link";
import { ClipboardList, Package, Receipt, Users, Store } from "lucide-react";

const SAMPLE_ORGS = [
  { name: "Trigo Dorado", slug: "trigodorado" },
  { name: "Sabores Naturales", slug: "saboresnaturales" },
  { name: "La Esquina", slug: "laesquina" },
];

const STEPS = [
  {
    n: "01",
    title: "Registrás tu negocio",
    desc: "Nombre, subdominio y listo — tu tienda queda reservada al instante.",
  },
  {
    n: "02",
    title: "Elegís tu plan",
    desc: "Empezá gratis con 14 días de prueba, sin tarjeta.",
  },
  {
    n: "03",
    title: "Tu tienda está online",
    desc: "Productos, pedidos y panel de administración, listos para usar.",
  },
];

const FEATURES = [
  { icon: Package, label: "Productos", desc: "Catálogo con imágenes, precios y variantes." },
  { icon: Receipt, label: "Gastos", desc: "Proveedores, sueldos y costos fijos, todo trazado." },
  { icon: ClipboardList, label: "Pedidos", desc: "Seguimiento de estado en tiempo real." },
  { icon: Users, label: "Empleados", desc: "Roles y permisos por sucursal." },
];

export default function LandingPage() {
  return (
    <main>
      {/* HERO */}
      <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1
            className="font-bold leading-tight mb-5"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            }}
          >
            Tu negocio gastronómico,
            <br />
            <span style={{ color: "var(--gh-green)" }}>con tienda propia.</span>
          </h1>
          <p className="text-lg opacity-75 mb-8 max-w-md leading-relaxed">
            Pedidos, productos, gastos y equipo — administrado desde un
            panel, publicado en tu propio subdominio.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "var(--gh-mustard)", color: "var(--gh-ink)" }}
          >
            Crear mi tienda gratis
          </Link>
          <p className="text-xs opacity-50 mt-3">
            14 días de prueba · sin tarjeta de crédito
          </p>
        </div>

        {/* Ticket signature element */}
        <div
          className="relative rounded-lg p-6 mx-auto w-full max-w-[340px]"
          style={{
            background: "#FFFDF8",
            border: "1px dashed var(--gh-line)",
            boxShadow: "0 12px 40px rgba(36,26,18,0.12)",
          }}
        >
          <div
            className="flex items-center gap-2 text-xs uppercase tracking-widest mb-4 pb-3"
            style={{
              borderBottom: "1px dashed var(--gh-line)",
              fontFamily: "'IBM Plex Mono', monospace",
              opacity: 0.6,
            }}
          >
            <Store size={14} /> comanda · alta de tienda
          </div>

          <div className="flex flex-col gap-4">
            {SAMPLE_ORGS.map((org, i) => (
              <div
                key={org.slug}
                className="ticket-item"
                style={{ animationDelay: `${i * 2.2}s` }}
              >
                <p className="font-semibold text-sm">{org.name}</p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "var(--gh-green)",
                  }}
                >
                  → {org.slug}.gastrohub.com ✓ en línea
                </p>
              </div>
            ))}
          </div>

          <style>{`
            .ticket-item {
              opacity: 0.25;
              animation: ticketPulse 6.6s ease-in-out infinite;
            }
            @keyframes ticketPulse {
              0%, 8% { opacity: 0.25; }
              12%, 25% { opacity: 1; }
              33%, 100% { opacity: 0.25; }
            }
            @media (prefers-reduced-motion: reduce) {
              .ticket-item { animation: none; opacity: 1; }
            }
          `}</style>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <h2
          className="text-2xl font-bold text-center mb-12"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          Tres pasos, tu tienda online
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.n}>
              <span
                className="text-4xl font-bold block mb-2"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: "var(--gh-green)",
                  opacity: 0.5,
                }}
              >
                {step.n}
              </span>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm opacity-70 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#FFFDF8" }} className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2
            className="text-2xl font-bold text-center mb-12"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Todo lo que tu negocio necesita
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-5 rounded-2xl"
                style={{ border: "1px solid var(--gh-line)" }}
              >
                <Icon size={22} style={{ color: "var(--gh-green)" }} className="mb-3" />
                <p className="font-semibold text-sm mb-1">{label}</p>
                <p className="text-xs opacity-60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF REAL */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-widest opacity-50 mb-3">
          Ya en uso
        </p>
        <p className="text-lg font-medium max-w-md mx-auto">
          Sabores Naturales administra su producción diaria con GastroHub
          desde el día uno.
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24 text-center">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-lg transition-transform hover:scale-[1.03]"
          style={{ background: "var(--gh-ink)", color: "var(--gh-paper)" }}
        >
          Empezar ahora
        </Link>
      </section>
    </main>
  );
}