import crypto from "crypto";

export function generateInvitationToken() {
 
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = hashToken(rawToken)

  return { rawToken, tokenHash };
}

export function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}