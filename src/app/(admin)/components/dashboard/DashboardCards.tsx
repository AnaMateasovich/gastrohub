import React from "react";
import MetricCard from "./MetricCard";

type DashboardCardsProps = {
  stats: DashboardType;
};

const DashboardCards = ({ stats }: DashboardCardsProps) => {
  const sales = stats.sales;
  const expenses = stats.expenses;

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            label="Total facturado"
            value={`$${sales.totalRevenue}`}
          />
          <MetricCard label="Órdenes" value={sales.totalOrders} />
          <MetricCard
            label="Ticket promedio"
            value={`$${sales.averageTicket}`}
          />
          <MetricCard label="Clientes" value={sales.totalCustomers} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Envíos" value={sales.deliveries} />
          <MetricCard label="Retiros" value={sales.pickups} />
          <MetricCard
            label="Canceladas"
            value={sales.cancelled}
            valueColor="text-red-500"
          />
          <MetricCard
            label="Ganancia estimada"
            value={`$${sales.estimatedProfit}`}
            valueColor={
              sales.estimatedProfit < 0 ? "text-red-600" : "text-green-600"
            }
          />
        </div>
      </div>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
        <p className="font-medium text-sm mb-3">Productos más vendidos</p>
        <div className="flex flex-col gap-2">
          {sales.topProducts.map((p) => (
            <div key={p.name} className="flex justify-between text-sm">
              <span>{p.name}</span>
              <span className="text-[var(--color-text-secondary)]">
                {p.quantity} unidades
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4">
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Gastos del período — no incluye costo de mercadería ni ventas
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            label="Gastos totales"
            value={`$${expenses.total}`}
            valueColor="text-orange-600"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
