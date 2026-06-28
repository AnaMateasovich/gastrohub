"use client";
import { OrderType } from "@/src/app/types/order.type";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard";
import StatusFilter from "../../components/StatusFilter";
import { useInfiniteOrders } from "@/src/app/hooks/useInfiiteOrders";

type OrderListProps = {
  initialOrders: OrderType[];
  initialCursor: number | null;
};

const OrdersList = ({ initialCursor, initialOrders }: OrderListProps) => {
  const { orders, loading, hasMore, sentinelRef } = useInfiniteOrders(
    initialOrders,
    initialCursor,
  );
  const [activeStatus, setActiveStatus] = useState("ALL");

  const handleFilter = (status: string) => {
    setActiveStatus(status);
  };

  const filtered =
    activeStatus === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeStatus);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between mb-2">
        <h4 className="text-2xl font-semibold">Pedidos</h4>
        <Link
          href="/admin/pedidos/crear"
          className="bg-[var(--color-primary)] text-white px-6 py-1 font-bold rounded-sm"
        >
          Crear nuevo +
        </Link>
      </div>

      <StatusFilter onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((order) => (
          <Link href={`/admin/pedidos/${order.id}`} key={order.id}>
            <OrderCard order={order} />
          </Link>
        ))}
        <div ref={sentinelRef} className="h-4" />
      </div>

      {loading && <p className="text-center py-4">Cargando...</p>}
      {!hasMore && (
        <p className="text-center py-4 text-gray-400">No hay más órdenes</p>
      )}
    </section>
  );
};

export default OrdersList;
