// components/XlsFormFiller.tsx
"use client";

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";

// ─── helpers para inspeccionar el schema ───────────────────────────────────

function getInnerType(zodType: z.core.$ZodType): z.core.$ZodType {
  const def = (zodType as any)._zod?.def ?? (zodType as any)._def;
  const typeName = def?.type ?? def?.typeName;

  if (
    typeName === "optional" ||
    typeName === "nullable" ||
    typeName === "default"
  ) {
    return getInnerType(def.innerType ?? def.type);
  }
  if (typeName === "union") {
    return getInnerType(def.options[0]);
  }
  if (
    typeName === "transform" ||
    typeName === "effects" ||
    typeName === "pipe"
  ) {
    return getInnerType(def.in ?? def.schema);
  }
  return zodType;
}

function coerceValue(raw: unknown, zodType: any): unknown {
  const inner = getInnerType(zodType);
   const def = (inner as any)?._zod?.def ?? (inner as any)?._def;
  const typeName = def?.type ?? def?.typeName;

  if (typeName === "number") {
    if (typeof raw === "number") return raw;
    const str = String(raw ?? "").trim();
    if (str === "") return undefined;
    const normalized = str.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(normalized);
    return isNaN(n) ? undefined : n;
  }

  if (typeName === "boolean") {
    return ["true", "1", "si", "sí", "yes"].includes(String(raw).toLowerCase());
  }

  return String(raw ?? "").trim();
}

// ─── el componente ──────────────────────────────────────────────────────────

interface Props<T extends z.ZodObject<z.ZodRawShape>> {
  schema: T;
  onRowParsed: (data: z.infer<T>, rowIndex: number, errors: string[]) => void;
  /** Opcional: mapeo explícito de columna XLS → clave del schema.
   *  Si no se pasa, se intenta matchear por nombre exacto (case-insensitive). */
  columnMap?: Partial<Record<string, string>>;
}

export function XlsFormFiller<T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  onRowParsed,
  columnMap = {},
}: Props<T>) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);

  const schemaKeys = Object.keys(schema.shape);

  const resolveKey = (col: string): string | undefined => {
    const colLower = col.toLowerCase().trim();
    // 1. Mapeo explícito
    const explicit = columnMap[col] ?? columnMap[colLower];
    if (explicit) return explicit;
    // 2. Match directo (case-insensitive)
    return schemaKeys.find((k) => k.toLowerCase() === colLower);
  };

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
          defval: "",
          raw: false,
        });

        setRowCount(rows.length);

        rows.forEach((row, i) => {
          const parsed: Record<string, unknown> = {};

          Object.entries(row).forEach(([col, raw]) => {
            const key = resolveKey(col);
            if (key && (schema.shape as Record<string, z.core.$ZodType>)[key]) {
              parsed[key] = coerceValue(
                raw,
                (schema.shape as Record<string, z.core.$ZodType>)[key],
              );
            }
          });

          const result = schema.safeParse(parsed);

          if (result.success) {
            onRowParsed(result.data, i, []);
          } else {
            const errors = result.error.issues.map(
              (e) => `${e.path.join(".")}: ${e.message}`,
            );
            onRowParsed(parsed as z.infer<T>, i, errors);
          }
        });
      };

      reader.readAsBinaryString(file);
    },
    [schema, columnMap, onRowParsed],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => document.getElementById("xls-input")?.click()}
    >
      <input
        id="xls-input"
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleChange}
      />

      {fileName ? (
        <p className="text-sm">
          <span className="font-medium">{fileName}</span>
          <span className="text-muted-foreground ml-2">
            · {rowCount} filas detectadas
          </span>
        </p>
      ) : (
        <>
          <p className="font-medium text-sm">
            Subí un archivo para autocompletar
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            .xlsx · .xls · .csv
          </p>
        </>
      )}
    </div>
  );
}
