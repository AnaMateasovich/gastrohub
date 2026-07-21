import { prisma } from "@/src/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params; 
    const id = parseInt(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const order = await prisma .order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        User: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = [
      "PENDING",
      "PREPARING",
      "READY",
      "SHIPPED",
      "PICKEDUP",
      "CANCELLED"
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const updatedOrder = await prisma .order.update({
      where: { id: Number(id) },
      data: { status },
    });
    revalidateTag(`orders-${session.organizationId}`, "");
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 },
    );
  }
}
