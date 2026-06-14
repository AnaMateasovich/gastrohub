"use server";
import { getOrders } from "@/src/lib/orders";
import OrdersList from "./OrdersList";
import { OrderType } from "@/src/app/types/order.type";

const page = async () => {
  const { orders, nextCursor } = await getOrders();

  return <OrdersList initialOrders={orders} initialCursor={nextCursor} />;
};

export default page;
