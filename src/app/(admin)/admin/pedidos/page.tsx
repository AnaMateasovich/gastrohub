'use server'
import { getOrders } from "@/src/lib/orders";
import OrdersList from "./OrdersList";
import { OrderType } from "@/src/app/types/order.type";

const page = async () => {
  const orders: OrderType[] = await getOrders();

  return <OrdersList orders={orders} />;
};

export default page;
