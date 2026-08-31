"use server";
import { revalidateTag } from "next/cache";
import { prisma } from "../prisma";
import { CreateOrderInput } from "../../app/types/order.type";
import { Product, Role } from "@prisma/client";
import { createOrderSchema } from "../validations/order.schema";
import { requireRole } from "../auth/role";
import { getCurrentTenant } from "../tenant/tenant";

export async function createOrder(data: CreateOrderInput) {
  const tenant = await getCurrentTenant();
  const organizationId = tenant.id;

  const parsed = createOrderSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Datos invalidos");
  }

  const {
    customerName,
    customerLastname,
    email,
    phone,
    address,
    orderItems,
    wantsDelivery,
    customerId,
  } = parsed.data;

  const settings = await prisma.storeSettings.findUnique({
    where: { organizationId: organizationId },
  });

  if (!settings) {
    throw new Error("Configuración no encontrada");
  }

  const products: Product[] = await prisma.product.findMany({
    where: {
      id: { in: orderItems.map((item) => item.productId) },
      organizationId: organizationId,
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

  let finalCustomerId = customerId;

  if (!finalCustomerId) {
    const customer = await prisma.customer.upsert({
      where: {
        organizationId_email: {
          organizationId: organizationId,
          email,
        },
      },
      update: {}, // no pisamos datos si ya existía
      create: {
        organizationId: organizationId,
        name: customerName,
        lastname: customerLastname,
        email,
        phone,
        address,
      },
    });
    finalCustomerId = customer.id;
  }

  await prisma.order.create({
    data: {
      organizationId: organizationId,
      customerId: finalCustomerId,
      customerName,
      customerLastname,
      email,
      phone,
      address,

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

  revalidateTag(`orders-${organizationId}`, "");
}

export async function updateStatusOrder(id: number, status: string) {
  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  await prisma.order.update({
    where: { id, organizationId: session.organizationId },
    data: { status },
  });
  revalidateTag(`orders-${session.organizationId}`, "");
}
