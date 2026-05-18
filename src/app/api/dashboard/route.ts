import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { OrderType } from "../../types/order.type";
import { getCostByProductId } from "@/src/lib/costs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const fromDate = searchParams.get("from") ?? formatDate(lastWeek);
  const toDate = searchParams.get("to") ?? formatDate(today);

  const startDate = new Date(fromDate);

  const endDate = new Date(toDate);
  endDate.setDate(endDate.getDate() + 1);
  const orders = await prisma.orders.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: "CANCELLED" },
    },
    include: { orderItems: { include: { product: true } } },
  });

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
      createdAt: { gte: new Date(fromDate), lte: new Date(toDate) },
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

  const costByProduct = await getCostByProductId();

  const totalCost = orders.reduce((acc: number, order: OrderType) => {
    return (
      acc +
      order.orderItems.reduce((itemAcc, item) => {
        const unitCost = costByProduct.get(item.productId) ?? 0;
        return itemAcc + unitCost * item.quantity;
      }, 0)
    );
  }, 0);

  const estimatedProfit = Math.round(totalRevenue - totalCost);

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    averageTicket,
    totalCustomers,
    deliveries,
    pickups,
    cancelled,
    topProducts,
    estimatedProfit,
  });
}
