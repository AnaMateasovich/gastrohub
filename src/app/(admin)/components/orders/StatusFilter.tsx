"use client";
import React, { useState } from "react";
import { OrderStatus } from "../../types/orderStatus.type";

type FilterStatus = OrderStatus | "ALL"

const StatusFilter = ({ onFilter }: { onFilter: (status: FilterStatus) => void }) => {
  const [selected, setSelected] = useState<FilterStatus>("ALL");

  const filters: {id: FilterStatus; label: string}[] = [
    { id: "ALL", label: "Todos" },
    { id: "PENDING", label: "Pendientes" },
    { id: "PREPARING", label: "En preparación" },
    { id: "READY", label: "Listos" },
    { id: "SHIPPED", label: "Enviados" },
    { id: "PICKEDUP", label: "Retirados" },
    { id: "CANCELLED", label: "Cancelados" },
  ];

    const handleSelect = (id: FilterStatus) => {
    setSelected(id);
    onFilter(id); 
  };

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {filters.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleSelect(id)}
          className={`px-3 py-1 rounded-sm whitespace-nowrap ${selected === id ? "bg-[var(--color-primary)] text-white" : "bg-gray-200"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
