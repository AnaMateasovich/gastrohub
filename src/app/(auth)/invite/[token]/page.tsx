import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { hashToken } from "@/src/lib/auth/invitation-token";
import { AcceptInvitationForm } from "../../components/AcceptInvitationForm";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = await params;

  const headersList = await headers();
  const organizationSlug = headersList.get("x-tenant-slug");

  if (!organizationSlug) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { slug: organizationSlug },
  });

  if (!organization) return notFound();

  const tokenHash = hashToken(token);

  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash },
    include: { employeeRole: true },
  });

  const isInvalid =
    !invitation ||
    invitation.organizationId !== organization.id || 
    invitation.status !== "PENDING" ||             
    invitation.expiresAt < new Date();             

  if (isInvalid) {
    return (
      <div>
        <h1>Este link de invitación no es válido o ya expiró</h1>
        <p>Pedile a quien te invitó que te reenvíe una nueva invitación.</p>
      </div>
    );
  }

  return (
    <AcceptInvitationForm
      token={token}
      email={invitation.email}
      roleName={invitation.employeeRole.name}
      organizationName={organization.name}
    />
  );
}