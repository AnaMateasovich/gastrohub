import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const settings = await prisma.storeSettings.findFirst()
    return NextResponse.json(settings)
}