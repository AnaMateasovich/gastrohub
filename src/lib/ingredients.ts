import { Role } from "@prisma/client";
import { requireRole } from "./auth/role";
import { prisma } from "./prisma";
import { getCurrentTenant } from "./tenant";

export const getIngredients = async () => {
const session = await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

  return prisma.ingredients.findMany({
    where: {
      organizationId: session.organizationId,
    },
  });
};
