"use client";

import React, { useEffect, useState } from "react";
import DateFilter from "../components/DateFilter";
import DashboardCards from "../components/DashboardCards";

type DashboardData = {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  totalCustomers: number;
  deliveries: number;
  pickups: number;
  cancelled: number;
  topProducts: { name: string; quantity: number }[];
  estimatedProfit: number;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

const DashboardPage = () => {
  const [from, setFrom] = useState(formatDate(lastWeek));
  const [to, setTo] = useState(formatDate(today));
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/dashboard?from=${from}&to=${to}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchData();
  }, [from, to]);
  return (
    <div className="px-2">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <DateFilter from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      {loading && <p className="text-sm text-gray-500 mt-2">Cargando...</p>}
      {!loading && data && (
        <DashboardCards
          totalRevenue={data.totalRevenue}
          totalOrders={data.totalOrders}
          averageTicket={data.averageTicket}
          totalCustomers={data.totalCustomers}
          deliveries={data.deliveries}
          pickups={data.pickups}
          cancelled={data.cancelled}
          topProducts={data.topProducts}
          estimatedProfit={data.estimatedProfit}
        />
      )}
    </div>
  );
};

export default DashboardPage;