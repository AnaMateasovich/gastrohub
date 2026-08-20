"use server";

import { prisma } from "@/src/lib/prisma";
import { z } from "zod";
import { requireRole } from "../auth/role";
import { revalidateTag } from "next/cache";

const createRoleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(50),
});

export async function createEmployeeRole(
  input: z.infer<typeof createRoleSchema>,
) {
  const { organizationId } = await requireRole(["OWNER", "ADMIN"]);
  const data = createRoleSchema.parse(input);

  const role = await prisma.employeeRole.create({
    data: { organizationId, name: data.name },
  });

  revalidateTag(`employee-roles-${organizationId}`, "");
  return role;
}
