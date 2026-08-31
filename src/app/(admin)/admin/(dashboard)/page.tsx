import { getDashboardStats } from "../../../services/dashboard.service";
import { Suspense } from "react";
import DashboardCards from "../../components/dashboard/DashboardCards";

const Dashboard = async () => {
  const stats = await getDashboardStats();
  if (!stats) return <p>No hay datos</p>;
  return <DashboardCards stats={stats} />;
};

export default function Page() {
  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Resumen de tu tienda</p>
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}