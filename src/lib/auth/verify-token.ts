"server-only";

import { Role } from "@prisma/client";
import { jwtVerify } from "jose";

type TokenPayload = {
  userId: string;
  organizationId: string;
  organizationSlug: string; 
  role: Role;
};

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!),
  );
  return payload as TokenPayload;
}
