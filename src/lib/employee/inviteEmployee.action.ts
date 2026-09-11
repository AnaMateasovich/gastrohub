"use server"

import z from "zod";
import { requireRole } from "../auth/role";
import { generateInvitationToken } from "../auth/invitation-token";
import { prisma } from "../prisma";
import { after } from "next/server";
import { addDays } from "date-fns";
import { sendInvitationEmail } from "../emails/send-invitation-email";
import { revalidateTag } from "next/cache";

const inviteEmployeeSchema = z.object({
  email: z.string().email(),
  employeeRoleId: z.string().cuid(),
  role: z.enum(["OWNER", "ADMIN", "STAFF"]).default("STAFF"),
});

const grantAccessSchema = z.object({
  employeeId: z.number(),
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "STAFF"]).default("STAFF"),

});

export async function inviteEmployee(data: z.infer<typeof inviteEmployeeSchema>) {

  const { organizationId, organizationSlug, userId } = await requireRole(["OWNER"]);

  const { email, employeeRoleId, role } = inviteEmployeeSchema.parse(data);

  const { rawToken, tokenHash } = generateInvitationToken();
  const expiresAt = addDays(new Date(), 7);

  const invitation = await prisma.invitation.upsert({
    where: {
      org_email_unique: { organizationId, email },
    },
    update: {
      tokenHash,
      expiresAt,
      employeeRoleId,
      role,
      status: "PENDING",
      invitedById: userId,
    },
    create: {
      email,
      tokenHash,
      expiresAt,
      employeeRoleId,
      role,
      organizationId,
      invitedById: userId,
    },
  });

  after(async () => {
    await sendInvitationEmail({
      to: email,
      rawToken,
      organizationSlug,
    });
  });

  return { success: true, invitationId: invitation.id };
}

export async function inviteEmployeeAccess(
  data: z.infer<typeof grantAccessSchema>
) {
  const { organizationId, userId, organizationSlug } = await requireRole(["OWNER"]);
  const { employeeId, email, role } = grantAccessSchema.parse(data);

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, organizationId },
  });

  if (!employee) {
    throw new Error("EMPLOYEE_NOT_FOUND");
  }

  if (employee.userId) {
    throw new Error("EMPLOYEE_ALREADY_HAS_ACCESS");
  }

  const { rawToken, tokenHash } = generateInvitationToken();
  const expiresAt = addDays(new Date(), 7);

  await prisma.invitation.upsert({
    where: { org_email_unique: { organizationId, email } },
    update: {
      tokenHash,
      expiresAt,
      role,
      employeeRoleId: employee.employeeRoleId!,
      employeeId,
      status: "PENDING",
      invitedById: userId,
    },
    create: {
      email,
      tokenHash,
      expiresAt,
      role,
      employeeRoleId: employee.employeeRoleId!,
      employeeId,
      organizationId,
      invitedById: userId,
    },
  });

  after(async () => {
    await sendInvitationEmail({ to: email, rawToken, organizationSlug });
  });

  revalidateTag(`employee-${organizationId}`, "");
  return { success: true };
}