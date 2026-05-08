import { NextResponse } from "next/server"
import { getUser } from "./user"

export const requireAdmin = async () => {
  const user = await getUser();
  
  if (!user || user.role !== "ADMIN") {
    return new NextResponse("No autorizado", { status: 403 });
  }
  
  return null;
};