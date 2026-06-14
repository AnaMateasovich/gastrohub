import { cacheLife, cacheTag } from "next/cache";
import { OrderType } from "../app/types/order.type";
import { mapOrder } from "../utils/orders.utils";
import { prisma } from "./prisma";

const PAGE_SIZE = 20;

export async function getOrders(
  cursor?: number,
): Promise<{ orders: OrderType[]; nextCursor: number | null }> {
  "use cache";
  cacheTag("orders");
  cacheLife("max");

  const orders = await prisma.orders.findMany({
    take: PAGE_SIZE + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  const hasMore = orders.length > PAGE_SIZE;
  const page = hasMore ? orders.slice(0, PAGE_SIZE) : orders;
  const nextCursor = hasMore ? page[page.length - 1].id : null;

  return {
    orders: page.map(mapOrder),
    nextCursor,
  };
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
