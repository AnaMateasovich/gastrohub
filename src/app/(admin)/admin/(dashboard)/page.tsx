import { Suspense } from "react";
import DashboardCards from "../../components/dashboard/DashboardCards";
import { getDashboardStats } from "@/src/lib/dashboard";
import DashboardDateFilter from "../../components/dashboard/DashboardDateFilter";

type DashboardProps = {
  from?: string;
  to?: string;
};

const Dashboard = async ({ from, to }: DashboardProps) => {
  const stats = await getDashboardStats(from, to);
  return <DashboardCards stats={stats} />;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Resumen de tu tienda
        </p>
      </div>
      <DashboardDateFilter />
      <Suspense key={`${from}-${to}`} fallback={<div>Cargando...</div>}>
        <Dashboard from={from} to={to} />
      </Suspense>
    </div>
  );
}
