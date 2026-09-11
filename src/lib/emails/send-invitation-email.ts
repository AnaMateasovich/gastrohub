import { Resend } from "resend";
import { InvitationEmail } from "./invitation-email";

const resend = new Resend(process.env.RESEND_API_KEY);

interface sendInvitationEmailParams {
  to: string;
  rawToken: string;
  organizationSlug: string;
}

export async function sendInvitationEmail({
  to,
  rawToken,
  organizationSlug,
}: sendInvitationEmailParams) {
  // const inviteUrl = `https://${organizationSlug}.${BASE_URL}/invite/${rawToken}`;

  const inviteUrl = `http://${organizationSlug}.lvh.me:3000/invite/${rawToken}`;

  if (!process.env.INVITATION_EMAIL) {
    throw new Error("Falta configurar INVITATION_EMAIL en el .env");
  }

  const { error } = await resend.emails.send({
    from: process.env.INVITATION_EMAIL, 
    to,
    subject: "Te invitaron a unirte a un equipo de GastroHub",
    react: InvitationEmail({ inviteUrl }),
  });

  if (error) {
    console.error("Error sending invitation email:", error);
  }
}
