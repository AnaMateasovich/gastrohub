import React from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { RegisterType } from "../../types/register.type";
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
    features: [
      "Hasta 20 productos",
      "1 usuario administrador",
      "Pedidos ilimitados",
    ],
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
    features: [
      "Todo lo de Starter",
      "Usuarios ilimitados",
      "Multi-sucursal",
      "Soporte prioritario",
    ],
  },
];
type PricingCardsProps = {
  setValue: UseFormSetValue<RegisterType>;
  watch: UseFormWatch<RegisterType>;
  error?: string;
};

const PricingCards = ({ setValue, watch, error }: PricingCardsProps) => {
  const selectedPlan = watch("plan");
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
   return (
            <button
              key={plan.id}
              type="button"
              onClick={() =>
                setValue("plan", plan.id, { shouldValidate: true })
              }
              className={`relative flex flex-col text-left gap-2 rounded-2xl border-2 p-4 transition-all cursor-pointer
                ${
                  isSelected
                    ? "border-[var(--color-primary-dark)] bg-[var(--color-primary-dark)]/10 shadow-md"
                    : "border-gray-600 bg-white hover:border-gray-500"
                }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 right-4 bg-[var(--color-primary-dark)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  Recomendado
                </span>
              )}

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">{plan.name}</span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    isSelected
                      ? "border-[var(--color-primary-dark)] bg-[var(--color-primary-dark)]"
                      : "border-gray-300"
                  }`}
                />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs text-gray-500">{plan.period}</span>
                )}
              </div>

              <p className="text-xs text-gray-500">{plan.description}</p>

              <ul className="flex flex-col gap-1 mt-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-1.5 text-xs text-gray-600"
                  >
                    <Check
                      size={14}
                      className="text-[var(--color-primary-dark)] flex-shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-500 text-xs px-1">{error}</p>}
    </div>
  );
};

export default PricingCards;
