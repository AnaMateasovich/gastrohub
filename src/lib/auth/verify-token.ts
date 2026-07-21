"server-only";

import { Role } from "@prisma/client";
import { jwtVerify } from "jose";

type SessionPayload = {
  userId: string;
  organizationId: string;
  role: Role;
};

export async function verifyToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!),
  );

  return payload as SessionPayload;
}
