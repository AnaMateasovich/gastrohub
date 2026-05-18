"use client";
import { OrderType } from "@/src/app/types/order.type";
import Link from "next/link";
import { useState } from "react";
import OrderCard from "../../components/OrderCard";
import StatusFilter from "../../components/StatusFilter";

type OrderListProps = {
  orders: OrderType[];
};

const OrdersList = ({ orders }: OrderListProps) => {
  const [filtered, setFiltered] = useState<OrderType[]>(orders);

  const handleFilter = (status: string) => {
    setFiltered(
      status === "ALL" ? orders : orders.filter((o) => o.status === status),
    );
  };

  return (
    <section className="flex flex-col gap-3 px-2">
      <h4 className="text-2xl font-semibold">Pedidos</h4>
      <StatusFilter onFilter={handleFilter} />
      {filtered.map((order) => (
        <Link href={`/admin/pedidos/${order.id}`} key={order.id}>
          <OrderCard order={order} />
        </Link>
      ))}
    </section>
  );
};

export default OrdersList;
