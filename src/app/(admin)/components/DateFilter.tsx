'use client'

type DateFilterProps = {
  from: string;
  to: string;
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
};

const DateFilter = ({ from, to, onFromChange, onToChange }: DateFilterProps) => {


  return (
<div className="flex gap-3 items-center bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-2 shadow-[var(--shadow-sm)]">
  <div className="flex flex-col gap-1">
    <label className="text-xs text-[var(--color-text-secondary)]">Desde</label>
    <input
      type="date"
      value={from}
      onChange={(e) => onFromChange(e.target.value)}
      className="bg-transparent text-sm text-[var(--color-text-primary)] outline-none cursor-pointer"
    />
  </div>
  <span className="text-[var(--color-text-secondary)]">—</span>
  <div className="flex flex-col gap-1">
    <label className="text-xs text-[var(--color-text-secondary)]">Hasta</label>
    <input
      type="date"
      value={to}
      onChange={(e) => onToChange(e.target.value)}
      className="bg-transparent text-sm text-[var(--color-text-primary)] outline-none cursor-pointer"
    />
  </div>
</div>
  );
};

export default DateFilter;
