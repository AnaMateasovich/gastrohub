import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const getCachedOrders = unstable_cache(
  async () => prisma.orders.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: true }
      }
    }
  }),
  ["orders"],
  { tags: ["orders"] }
)