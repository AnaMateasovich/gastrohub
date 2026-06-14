import { getOrders } from "@/src/lib/orders";
import { prisma } from "@/src/lib/prisma";
import { Orders_status as OrderStatus, Prisma, Product } from "@prisma/client";
import { create } from "domain";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const orderItemsSechema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string(),
  phone: z.string().min(6),
  address: z.string().min(3),
  userId: z.string().optional(),
  items: z.array(orderItemsSechema).min(1),
  deliveryFee: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const {
      customerName,
      email,
      phone,
      address,
      items,
      userId,
      deliveryFee = 0,
      discount = 0,
    } = parsed.data;

    const products: Product[] = await prisma.product.findMany({
      where: {
        id: {
          in: items.map((item) => item.productId),
        },
      },
    });

    let subtotal = 0;

    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error("Not enough stock");
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const discountAmount = Number((subtotal * (discount / 100)).toFixed(2));
    const total = Number((subtotal + deliveryFee - discountAmount).toFixed(2));

    const order = await prisma.orders.create({
      data: {
        customerName,
        email,
        phone,
        address,
        userId: userId || null,
        subtotal: new Prisma.Decimal(subtotal),
        total: new Prisma.Decimal(total),
        deliveryFee: new Prisma.Decimal(deliveryFee),
        discount: new Prisma.Decimal(discount),
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor");
  const data = await getOrders(cursor ? Number(cursor) : undefined);
  return NextResponse.json(data);
}