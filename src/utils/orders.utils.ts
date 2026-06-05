import { OrderType } from "../app/types/order.type";

export function mapOrder(order: OrderType): OrderType {
  return {
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    orderItems: (order.orderItems ?? []).map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
        extraCost: Number(item.product.extraCost),
        saleAmount: Number(item.product.saleAmount),
        manualCost: item.product.manualCost
          ? Number(item.product.manualCost)
          : null,
      },
    })),
  };
}
