import React from 'react'

const MetricCard = ({ label, value, valueColor = "text-[var(--color-text-primary)]" }: { label: string; value: string | number; valueColor?: string }) => (
  <div className="bg-[var(--color-natural-bg)] rounded-[var(--radius-sm)] p-4">
    <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
    <p className={`text-2xl font-medium mt-1 ${valueColor}`}>{value}</p>
  </div>
);

export default MetricCard