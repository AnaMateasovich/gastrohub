import { Role } from "@prisma/client";

export const roleLabels:Record<Role, string> = {
  OWNER: "Dueño",
  ADMIN: "Administrador",
  STAFF: "Empleado"
}

export function getAssignableRoles(): Role[] {
  return Object.values(Role);
}