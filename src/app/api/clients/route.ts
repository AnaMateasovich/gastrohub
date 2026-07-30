import { requireRole } from "@/src/lib/auth/role";
import { prisma } from "@/src/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("email");
  if (!search) return NextResponse.json([]);

  const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  const clients = await prisma.customer.findMany({
    where: {
      organizationId: session.organizationId,
      OR: [{ name: { contains: search } }, { email: { contains: search } }],
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
      phone: true,
      address: true,
    },
  });

  return NextResponse.json(clients);
}
