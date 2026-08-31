import { prisma } from "@/src/lib/prisma";
import { slugify } from "@/src/utils/slug.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const slug = slugify(name);

  const existing = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
