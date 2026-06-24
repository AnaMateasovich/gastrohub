import React from 'react'

const SettingsGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-sm)] flex flex-col gap-2">
    <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-bold">
      {title}
    </p>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);


export default SettingsGroup