import { Role } from "@prisma/client";
import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "./prisma";
import {
  calcCustomers,
  calcDeliveriesPickups,
  calcEstimatedProfit,
  calcRevenue,
  calcTopProducts,
} from "./dashboard-metrics";
import { OrderType } from "../app/types/order.type";
import { withOrg } from "./auth/with-org";
import { OrderItemType } from "../app/types/orderItem";
import { RecipeItemType } from "../app/types/recipe.type";
import { getExpensesTotalCached } from "./expense";

function resolveRange(from?: string, to?: string) {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { fromISO: from ?? fmt(lastWeek), toISO: to ?? fmt(today) };
}

const getOrdersForDashboardCached = async (
  organizationId: string,
  fromISO: string,
  toISO: string,
) => {
  "use cache";
  cacheTag(`dashboard-${organizationId}`);
  cacheLife("max");

  const startDate = new Date(fromISO);
  const endDate = new Date(toISO);
  endDate.setDate(endDate.getDate() + 1);

  const orders = await prisma.order.findMany({
    where: {
      organizationId,
      createdAt: { gte: startDate, lte: endDate },
      status: { not: "CANCELLED" },
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              recipe: { include: { items: { include: { ingredient: true } } } },
            },
          },
        },
      },
    },
  });

  return orders.map((order: OrderType) => ({
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    orderItems: order.orderItems.map((item: OrderItemType) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
        stock: Number(item.product.stock),
        saleAmount: Number(item.product.saleAmount),
        recipe: item.product.recipe
          ? {
              ...item.product.recipe,
              yield: Number(item.product.recipe.yield),
              items: item.product.recipe.items.map((ri) => ({
                ...ri,
                quantity: Number(ri.quantity),
                ingredient: {
                  ...ri.ingredient,
                  price: Number(ri.ingredient.price),
                  stock: Number(ri.ingredient.stock),
                },
              })),
            }
          : null,
      },
    })),
  }));
};

const getCancelledCountCached = async (
  organizationId: string,
  fromISO: string,
  toISO: string,
) => {
  "use cache";
  cacheTag(`dashboard-${organizationId}`);
  cacheLife("max");

  const startDate = new Date(fromISO);
  const endDate = new Date(toISO);
  endDate.setDate(endDate.getDate() + 1);

  return prisma.order.count({
    where: {
      organizationId,
      createdAt: { gte: startDate, lte: endDate },
      status: "CANCELLED",
    },
  });
};

export async function getDashboardStats(from?: string, to?: string) {
  return withOrg(
    [Role.OWNER, Role.ADMIN, Role.STAFF],
    async (organizationId) => {
      const { fromISO, toISO } = resolveRange(from, to);

      const [orders, cancelled, totalExpenses] = await Promise.all([
        getOrdersForDashboardCached(organizationId, fromISO, toISO),
        getCancelledCountCached(organizationId, fromISO, toISO),
        getExpensesTotalCached(organizationId, fromISO, toISO),
      ]);

      const sales =
        orders.length === 0
          ? {
              totalRevenue: 0,
              totalOrders: 0,
              averageTicket: 0,
              totalCustomers: 0,
              deliveries: 0,
              pickups: 0,
              cancelled,
              topProducts: [],
              estimatedProfit: 0,
            }
          : {
              totalRevenue: calcRevenue(orders),
              totalOrders: orders.length,
              averageTicket: Math.round(calcRevenue(orders) / orders.length),
              totalCustomers: calcCustomers(orders),
              ...calcDeliveriesPickups(orders),
              cancelled,
              topProducts: calcTopProducts(orders),
              estimatedProfit: calcEstimatedProfit(orders),
            };

      return {
        sales, // todo lo que sale de Order
        expenses: { total: totalExpenses }, // todo lo que sale de Expense
      };
    },
  );
}
