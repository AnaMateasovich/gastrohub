import { OrderType } from "../app/types/order.type";
import { mapProduct } from "../utils/products.utils";
import { getProductProfit } from "./costs";

export function calcRevenue(orders: OrderType[]) {
  return orders.reduce((acc, o) => acc + Number(o.total), 0);
}

export function calcCustomers(orders: OrderType[]) {
  return new Set(orders.map((o) => o.email)).size;
}

export function calcDeliveriesPickups(orders: OrderType[]) {
  const deliveries = orders.filter((o) => Number(o.deliveryFee) > 0).length;
  const pickups = orders.length - deliveries;
  return { deliveries, pickups };
}

export function calcTopProducts(orders: OrderType[], limit = 5) {
  const productMap = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.orderItems) {
      const name = item.product.name;
      productMap.set(name, (productMap.get(name) ?? 0) + item.quantity);
    }
  }
  return Array.from(productMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export function calcEstimatedProfit(orders: OrderType[]) {
  const totalRevenue = calcRevenue(orders);
  const totalCost = orders.reduce((acc, order) => {
    const orderCost = order.orderItems.reduce((itemAcc, item) => {
      const unitCost = Number(getProductProfit(mapProduct(item.product))?.cost ?? 0);
      return itemAcc + unitCost * item.quantity;
    }, 0);
    return acc + orderCost;
  }, 0);
  return Math.round(totalRevenue - totalCost);
}