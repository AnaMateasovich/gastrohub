import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("email");
  if (!search) return NextResponse.json([]);

  const clients = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: search} },
        { email: { contains: search} },
      ],
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
