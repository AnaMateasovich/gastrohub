import { BASE_URL } from "@/src/lib/api";
import z from "zod";

const orderItemsSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
})

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string(),
  phone: z.string().min(6),
  address: z.string().min(3),
  userId: z.string().optional(),
  items: z.array(orderItemsSchema).min(1),
  deliveryFee: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const fetchOrders = async (status: string) => {
  const params = status !== "ALL" ? `?status=${status}` : "";
  const res = await fetch(`${BASE_URL}/api/orders${params}`);
  return res.json();
};

// export const updateStatusOrder = async (orderId: number, newStatus: string) => {
//   const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status: newStatus }),
//   });
//   if (!res.ok) throw new Error("Error actualizando status");
//   return res.json();
// };


