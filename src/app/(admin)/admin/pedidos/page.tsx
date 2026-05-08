import { getCachedOrders } from "@/src/lib/orders";
import OrdersList from "./OrdersList";
import { OrderType } from "@/src/app/types/order.type";

const page = async () => {

  const orders: OrderType[] = await getCachedOrders()
  return <OrdersList  orders={orders}/>;
};

export default page;
