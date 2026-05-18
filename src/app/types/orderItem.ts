import { OrderType } from "./order.type";
import { ProductType } from "./product.type";

export type OrderItemType = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  order: OrderType;
  price: Number;
  product: ProductType;
};
