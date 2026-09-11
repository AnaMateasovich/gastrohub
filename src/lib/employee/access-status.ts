type EmployeeAccessInfo = {
  userId: string | null;
  invitations: { id: string }[];
};

export function getEmployeeAccessStatus(employee: EmployeeAccessInfo) {
  if (employee.userId) return "ACTIVE" as const;
  if (employee.invitations.length > 0) return "PENDING" as const;
  return "NONE" as const;
}