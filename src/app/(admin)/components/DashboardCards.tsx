import React from "react";
import MetricCard from "./MetricCard";

type DashboardCardsProps = {
  stats: DashboardType;
};

const DashboardCards = ({ stats }: DashboardCardsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total facturado" value={`$${stats.totalRevenue}`} />
        <MetricCard label="Órdenes" value={stats.totalOrders} />
        <MetricCard label="Ticket promedio" value={`$${stats.averageTicket}`} />
        <MetricCard label="Clientes" value={stats.totalCustomers} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Envíos" value={stats.deliveries} />
        <MetricCard label="Retiros" value={stats.pickups} />
        <MetricCard
          label="Canceladas"
          value={stats.cancelled}
          valueColor="text-red-500"
        />
        <MetricCard
          label="Ganancia estimada"
          value={`$${stats.estimatedProfit}`}
          valueColor={
            stats.estimatedProfit < 0 ? "text-red-600" : "text-green-600"
          }
        />
      </div>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
        <p className="font-medium text-sm mb-3">Productos más vendidos</p>
        <div className="flex flex-col gap-2">
          {stats.topProducts.map((p) => (
            <div key={p.name} className="flex justify-between text-sm">
              <span>{p.name}</span>
              <span className="text-[var(--color-text-secondary)]">
                {p.quantity} unidades
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
