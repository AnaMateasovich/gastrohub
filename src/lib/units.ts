export const YIELD_UNITS = [
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "g", label: "Gramos (g)" },
  { value: "u", label: "Unidades (u)" },
  { value: "porciones", label: "Porciones" },
  { value: "l", label: "Litros (l)" },
  { value: "ml", label: "Mililitros (ml)" },
];

export const UNIT_CONVERSIONS: Record<
  string,
  { displayUnit: string; factor: number }
> = {
  kg: { displayUnit: "g", factor: 1000 },
  l: { displayUnit: "ml", factor: 1000 },
  g: { displayUnit: "g", factor: 1 },
  ml: { displayUnit: "ml", factor: 1 },
  u: { displayUnit: "u", factor: 1 },
};

export function toStorageUnit(value: number, unit: string): number {
    const conversion = UNIT_CONVERSIONS[unit]
    if(!conversion) return value
    return value / conversion.factor
}

export function toDisplayUnit(value: number, unit: string): number {
    const conversion = UNIT_CONVERSIONS[unit]
    if(!conversion) return value
    return value * conversion.factor
}

export function getDisplayUnit(unit: string): string {
    return UNIT_CONVERSIONS[unit]?.displayUnit ?? unit
}