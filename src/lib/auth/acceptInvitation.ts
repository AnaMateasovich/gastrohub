"use server";

import z from "zod";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { hashToken } from "./invitation-token";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { getCurrentTenant } from "../tenant/tenant";

const acceptInvitationSchema = z.object({
  token: z.string(),
  name: z.string().min(2),
  password: z.string().min(8),
});

export async function acceptInvitation(
  data: z.infer<typeof acceptInvitationSchema>,
) {
  const tenant = await getCurrentTenant();
  const { token, name, password } = acceptInvitationSchema.parse(data);
  const tokenHash = hashToken(token);

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const claimed = await tx.invitation.updateMany({
      where: {
        organizationId: tenant.id,
        tokenHash,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      data: { status: "ACCEPTED" },
    });

    if (claimed.count === 0) {
      throw new Error("INVITATION_ALREADY_USED_OR_EXPIRED");
    }

    const invitation = await tx.invitation.findUniqueOrThrow({
      where: { tokenHash },
    });

    const user = await tx.user.create({
      data: {
        name,
        email: invitation.email,
        password: passwordHash,
      },
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    });

    if (invitation.employeeId) {
      await tx.employee.update({
        where: {
          id: invitation.employeeId,
          organizationId: invitation.organizationId,
        },
        data: { userId: user.id },
      });
    } else {
      await tx.employee.create({
        data: {
          organizationId: invitation.organizationId,
          name,
          employeeRoleId: invitation.employeeRoleId,
          userId: user.id,
        },
      });
    }
  });

  redirect("/login?joined=true");
}
