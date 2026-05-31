import { cacheLife, cacheTag } from "next/cache";
import { OrderType } from "../app/types/order.type";
import { mapOrder } from "../utils/orders.utils";
import { prisma } from "./prisma";


export async function getOrders() {
  "use cache";
  cacheTag("orders");
  cacheLife("max");

  const orders = await prisma.orders.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });
  return orders.map(mapOrder);
}

export async function getOrderById(id: number): Promise<OrderType> {
  const order = await prisma.orders.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!order) throw new Error(`Order with id ${id} not found`);

  return mapOrder(order);
}