import "server-only"
import { prisma } from "../prisma";
import { cookies } from "next/headers";
import { verifyToken } from "./verify-token";

export async function getSession() {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: payload.userId,
          organizationId: payload.organizationId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!membership) {
      return null;
    }

    const { password, ...user } = membership.user;

    return {
      ...user,
      organizationId: payload.organizationId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
