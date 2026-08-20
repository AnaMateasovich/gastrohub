import { Decimal } from "@prisma/client/runtime/library";

export function formatNumber(value: number | string | Decimal): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "0";
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}