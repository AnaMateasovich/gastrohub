import { UserType } from "./user.type";
import { OrderItemType } from "./orderItem";
import { OrderStatus } from "./orderStatus.type";

export type OrderType = {
  id: number;
  customerName: string;
  phone: string;
  status: OrderStatus;
  createdAt: Date;
  email: string;
  address: string;
  userId: string | null;
  subtotal: number | null;
  total: number | null;
  deliveryFee: number | null;
  discount: number | null;
  note: string | null;
  user?: UserType;
  orderItems: OrderItemType[];
};
