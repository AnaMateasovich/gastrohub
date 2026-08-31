import Link from "next/link";
import { Check } from "lucide-react";

type Plan = {
  id: "FREE" | "STARTER" | "PRO";
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "FREE",
    name: "Gratis",
    price: "$0",
    description: "Para probar la plataforma sin compromiso",
    features: ["Hasta 20 productos", "1 usuario administrador", "Pedidos ilimitados"],
  },
  {
    id: "STARTER",
    name: "Starter",
    price: "$9.900",
    period: "/mes",
    description: "Para negocios que ya están vendiendo activamente",
    features: [
      "Productos ilimitados",
      "Hasta 3 usuarios",
      "Reportes básicos",
      "Soporte por email",
    ],
    highlighted: true,
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$19.900",
    period: "/mes",
    description: "Para equipos con varias sucursales",
    features: ["Todo lo de Starter", "Usuarios ilimitados", "Multi-sucursal", "Soporte prioritario"],
  },
];

export default function PricingPage() {
  return (
    <main className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1
          className="font-bold mb-4"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2rem, 4.5vw, 2.8rem)",
          }}
        >
          Un plan para cada etapa de tu negocio
        </h1>
        <p className="opacity-70 max-w-md mx-auto">
          Empezá gratis. Subí de plan cuando tu negocio lo pida, no antes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-2xl p-6 flex flex-col"
            style={{
              background: plan.highlighted ? "#FFFDF8" : "transparent",
              border: plan.highlighted
                ? "2px solid var(--gh-green)"
                : "1px solid var(--gh-line)",
              boxShadow: plan.highlighted ? "0 12px 32px rgba(36,26,18,0.10)" : "none",
            }}
          >
            {plan.highlighted && (
              <span
                className="absolute -top-3 right-6 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--gh-green)", color: "var(--gh-paper)" }}
              >
                Más elegido
              </span>
            )}

            <p className="font-semibold text-lg mb-1">{plan.name}</p>
            <p className="text-sm opacity-60 mb-4">{plan.description}</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-plex-mono), monospace" }}
              >
                {plan.price}
              </span>
              {plan.period && <span className="text-sm opacity-60">{plan.period}</span>}
            </div>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={16} style={{ color: "var(--gh-green)" }} className="mt-0.5 flex-shrink-0" />
                  <span className="opacity-80">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/register?plan=${plan.id}`}
              className="text-center py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                background: plan.highlighted ? "var(--gh-ink)" : "transparent",
                color: plan.highlighted ? "var(--gh-paper)" : "var(--gh-ink)",
                border: plan.highlighted ? "none" : "1px solid var(--gh-ink)",
              }}
            >
              Elegir {plan.name}
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-xs opacity-50 mt-12">
        Todos los planes incluyen 14 días de prueba. Cancelás cuando quieras.
      </p>
    </main>
  );
}