import { Role } from "@prisma/client";
import { getSession } from "./get-session";

export async function requireRole(allowedRoles: Role[]) {
  const session = await getSession();

  if (!session) {
    throw new Error("No autorizado");
  }

  if (!allowedRoles.includes(session.role)) {
    throw new Error("No tenés permisos");
  }

  return session;
}