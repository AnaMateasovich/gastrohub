import { cacheLife, cacheTag } from "next/cache";
import { OrderType } from "../app/types/order.type";
import { mapOrder } from "../utils/orders.utils";
import { prisma } from "./prisma";
import { getTenantFromHost } from "./tenant/tenant";
import { requireRole } from "./auth/role";
import { Role } from "@prisma/client";
import { withOrg } from "./auth/with-org";

const PAGE_SIZE = 20;

export async function getOrdersCached(
  organizationId: string,
  cursor?: number,
): Promise<{ orders: OrderType[]; nextCursor: number | null }> {
  "use cache";
  cacheTag(`orders-${organizationId}`);
  cacheLife("max");

  const orders = await prisma.order.findMany({
    where: {
      organizationId,
    },
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

export async function getOrders() {
  return withOrg([Role.OWNER, Role.ADMIN, Role.STAFF], getOrdersCached);
}

export async function getOrderById(id: number): Promise<OrderType> {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const order = await prisma.order.findUnique({
    where: { organizationId: session.organizationId, id },
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

export async function getOrdersCursor(cursor?: number) {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const orders = await prisma.order.findMany({
    where: {
      organizationId: session.organizationId,
    },
    take: 20,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    orderBy: {
      id: "desc",
    },
    include: {
      orderItems: true,
    },
  });

  return orders;
}
