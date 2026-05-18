"use server";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { prisma } from "./prisma";
import { CreateOrderInput, OrderType } from "../app/types/order.type";
import z from "zod";
import { Product } from "@prisma/client";
import { getUser } from "./user";

const orderItemsSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string(),
  phone: z.string().min(6),
  address: z.string().min(3),
  orderItems: z.array(orderItemsSchema).min(1),
  wantsDelivery: z.boolean(),
  discount: z.number().min(0).max(100).optional(),
});

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
  return orders.map((order: OrderType) => ({
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  }));
}

export async function createOrder(data: CreateOrderInput) {
  const session = await getUser();

  const parsed = createOrderSchema.safeParse(data);

  if (!parsed.success) {
    console.log(parsed.error.flatten());
    throw new Error("Datos invalidos");
  }

  const { customerName, email, phone, address, orderItems, wantsDelivery } =
    parsed.data;

  const userId = session?.user?.id ?? null;

  const settings = await prisma.storeSettings.findFirst();

  if (!settings) {
    throw new Error("Configuración no encontrada");
  }

  const products: Product[] = await prisma.product.findMany({
    where: {
      id: { in: orderItems.map((item) => item.productId) },
    },
  });

  let subtotal = 0;

  const orderItemsData = orderItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) throw new Error("Producto no encontrado");
    
    // no va a manejar stock por el momento
    // if (product.stock < item.quantity) throw new Error("Stock insuficiente");

    subtotal += Number(product.price) * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const deliveryFee = wantsDelivery ? Number(settings.deliveryFee) : 0;

  // todo: agregar cupones y descuentos...

  const discount = 0;

  const total = subtotal + deliveryFee;

  await prisma.orders.create({
    data: {
      customerName,
      email,
      phone,
      address,

      userId,

      subtotal,
      total,
      deliveryFee,
      discount,

      orderItems: {
        create: orderItemsData,
      },
    },
  });

  updateTag('orders')
}
