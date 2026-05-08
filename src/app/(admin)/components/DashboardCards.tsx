import React from 'react'
import MetricCard from './MetricCard'

type DashboardCardsProps = {
    totalOrders: number
    averageTicket: number
    totalCustomers: number
    deliveries: number
    pickups: number
    cancelled: number
    topProducts: {name: string, quantity: number}[]
    totalRevenue: number
    estimatedProfit: number
}

const DashboardCards = ({
   totalOrders, averageTicket, totalCustomers,
  deliveries, pickups, cancelled, topProducts, totalRevenue, estimatedProfit
}: DashboardCardsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total facturado" value={`$${totalRevenue}`} />
        <MetricCard label="Órdenes" value={totalOrders} />
        <MetricCard label="Ticket promedio" value={`$${averageTicket}`} />
        <MetricCard label="Clientes" value={totalCustomers} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Envíos" value={deliveries} />
        <MetricCard label="Retiros" value={pickups} />
        <MetricCard label="Canceladas" value={cancelled} valueColor="text-red-500" />
        <MetricCard label="Ganancia estimada" value={`$${estimatedProfit}`} valueColor="text-green-600" />
      </div>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
        <p className="font-medium text-sm mb-3">Productos más vendidos</p>
        <div className="flex flex-col gap-2">
          {topProducts.map((p) => (
            <div key={p.name} className="flex justify-between text-sm">
              <span>{p.name}</span>
              <span className="text-[var(--color-text-secondary)]">{p.quantity} unidades</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCards