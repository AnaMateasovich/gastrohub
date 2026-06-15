import { UserType } from "./user.type";
import { OrderItemType } from "./orderItem";
import { OrderStatus } from "./orderStatus.type";

export type OrderType = {
  id: number;
  customerName: string;
  customerLastname: string;
  phone: string;
  status: OrderStatus;
  createdAt: Date;
  email: string;
  address: string;
  userId: number | null;
  subtotal: number | null;
  total: number;
  deliveryFee: number | null;
  discount: number | null;
  note: string | null;
  user?: UserType;
  orderItems: OrderItemType[];
};

export type CreateOrderInput = {
  customerName: string
  customerLastname: string
  phone: string
  email: string
  address: string
  userId: string | null
  wantsDelivery: boolean
  orderItems: {
    productId: number
    quantity: number
  }[]
}