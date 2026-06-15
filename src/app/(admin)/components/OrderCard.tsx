import { OrderType } from "../../types/order.type";
import StatusOrder from "./StatusOrder";
import { ChevronRight, Dot } from "lucide-react";

type OrderCardProps = {
  order: OrderType;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const localDate = new Date(order.createdAt).toLocaleDateString();
  const total = order.orderItems?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="bg-white flex items-center justify-between px-4 py-2 shadow-md rounded-xl">
      <div className="flex flex-col ">
        <div className="flex items-center gap-2">
          <p className="text-lg">#{order.id}</p>
          <p className="text-gray-600">{localDate}</p>
        </div>
        <p className="text-xl font-semibold">{order.customerName} {order.customerLastname}</p>
        <div className="flex items-center text-gray-600">
          <p>{order.orderItems.length} productos</p>
          <Dot size={25} />
          <p>${total}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusOrder status={order.status} />
        <ChevronRight className="text-gray-600" />
      </div>
    </div>
  );
};

export default OrderCard;
