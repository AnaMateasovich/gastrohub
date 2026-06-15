"use server";
import { revalidateTag } from "next/cache";
import { prisma } from "../prisma";
import { CreateOrderInput } from "../../app/types/order.type";
import { Product } from "@prisma/client";
import { getUser } from "../user";
import { createOrderSchema } from "../validations/order.schema";

export async function createOrder(data: CreateOrderInput) {
  const session = await getUser();

  const parsed = createOrderSchema.safeParse(data);

  if (!parsed.success) {
     console.error(parsed.error.flatten());
    throw new Error("Datos invalidos");
  }

  const { customerName, customerLastname, email, phone, address, orderItems, wantsDelivery } =
    parsed.data;

  const userId = parsed.data.userId ?? session?.user?.id ?? null;

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
      customerLastname,
      email,
      phone,
      address,

      userId,
      status: "PENDING",
      subtotal,
      total,
      deliveryFee,
      discount,

      orderItems: {
        create: orderItemsData,
      },
    },
  });

  revalidateTag("orders", "");
}

export async function updateStatusOrder(id: number, status: string) {
  await prisma.orders.update({
    where: { id },
    data: { status },
  });
  revalidateTag("orders", "");
}
