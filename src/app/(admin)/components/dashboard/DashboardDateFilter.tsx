"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getPresetRange(preset: "week" | "month") {
  const to = new Date();
  const from = new Date();
  if (preset === "week") from.setDate(to.getDate() - 7);
  if (preset === "month") from.setMonth(to.getMonth() - 1);
  return { from: formatDate(from), to: formatDate(to) };
}

const DashboardDateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");

  const pushRange = (nextFrom: string, nextTo: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("from", nextFrom);
    params.set("to", nextTo);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const applyPreset = (preset: "week" | "month") => {
    const range = getPresetRange(preset);
    setFrom(range.from);
    setTo(range.to);
    pushRange(range.from, range.to);
  };

   function handleCustomApply() {
    if (!from || !to) {
      toast.error("Completá ambas fechas.");
      return;
    }
    if (from > to) {
      toast.error("La fecha 'desde' no puede ser posterior a 'hasta'.");
      return;
    }
    pushRange(from, to);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        type="button"
        onClick={() => applyPreset("week")}
        className="px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
      >
        Última semana
      </button>
      <button
        type="button"
        onClick={() => applyPreset("month")}
        className="px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
      >
        Último mes
      </button>

      <div className="flex items-center gap-1.5 ml-2">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="px-2 py-1.5 text-sm rounded-md border border-[var(--color-border)]"
        />
        <span className="text-sm text-[var(--color-text-secondary)]">a</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="px-2 py-1.5 text-sm rounded-md border border-[var(--color-border)]"
        />
        <button
          type="button"
          onClick={handleCustomApply}
          disabled={isPending}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-primary)] text-white disabled:opacity-50"
        >
          {isPending ? "..." : "Aplicar"}
        </button>
      </div>
    </div>
  );
};

export default DashboardDateFilter;
