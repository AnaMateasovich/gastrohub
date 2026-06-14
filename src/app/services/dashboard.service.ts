"use server";
import { prisma } from "@/src/lib/prisma";
import { getProductProfit } from "@/src/lib/costs";
import { OrderType } from "../types/order.type";
import { connection } from "next/server";
import { mapProduct } from "@/src/utils/products.utils";

export const getDashboardStats = async (from?: string, to?: string) => {
  await connection();
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const fromDate = from ?? formatDate(lastWeek);
  const toDate = to ?? formatDate(today);

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);
  endDate.setDate(endDate.getDate() + 1);

  const orders = await prisma.orders.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: "CANCELLED" },
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              recipe: {
                include: {
                  items: { include: { ingredient: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (orders.length === 0) return null;
  const totalRevenue = orders.reduce(
    (acc: number, order: OrderType) => acc + Number(order.total),
    0,
  );
  const totalOrders = orders.length;
  const averageTicket =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalCustomers = new Set(orders.map((o: OrderType) => o.email)).size;
  const deliveries = orders.filter(
    (o: OrderType) => Number(o.deliveryFee) > 0,
  ).length;
  const pickups = orders.filter(
    (o: OrderType) => Number(o.deliveryFee) === 0,
  ).length;

  const cancelled = await prisma.orders.count({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: "CANCELLED",
    },
  });

  const productMap = new Map<string, number>();
  orders.forEach((order: OrderType) => {
    order.orderItems.forEach((item) => {
      const name = item.product.name;
      productMap.set(name, (productMap.get(name) ?? 0) + item.quantity);
    });
  });

  const topProducts = Array.from(productMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const totalCost = orders.reduce((acc: number, order: OrderType) => {
    return (
      acc +
      order.orderItems.reduce((itemAcc, item) => {
        const profitData = getProductProfit(mapProduct(item.product));
        const unitCost = Number(profitData?.cost ?? 0);
        order.orderItems.forEach((item) => {

});
        return itemAcc + unitCost * item.quantity;
      }, 0)
    );
  }, 0);
  

  const estimatedProfit = Math.round(totalRevenue - totalCost);

  return {
    totalRevenue,
    totalOrders,
    averageTicket,
    totalCustomers,
    deliveries,
    pickups,
    cancelled,
    topProducts,
    estimatedProfit,
  };
};
