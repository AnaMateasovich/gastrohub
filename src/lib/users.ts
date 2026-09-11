"use server";
import { Prisma, Role } from "@prisma/client";
import { requireRole } from "./auth/role";
import { prisma } from "./prisma";

export type UserWithMembership = Prisma.UserGetPayload<{
  include: {
    memberships: {
      where: { organizationId: string };
    };
  };
}>;

export async function getUsersAdmin() {
  const session = await requireRole([Role.OWNER, Role.ADMIN]);

  const users = await prisma.user.findMany({
    where: {
      memberships: {
        some: {
          organizationId: session.organizationId,
        },
      },
    },
    include: {
      memberships: {
        where: { organizationId: session.organizationId },
      },
    },
  });

  return users.map((user: UserWithMembership) => {
    const { password: _, ...safeUser } = user;
    return {
      ...safeUser,
      createdAt: user.memberships[0].createdAt.toISOString(),
    };
  });
}
