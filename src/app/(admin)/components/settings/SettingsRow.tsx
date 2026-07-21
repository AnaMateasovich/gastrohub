const SettingsRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "success" | "danger";
}) => (
  <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-2 first:border-t-0 first:pt-0">
    <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
    <p
      className={`text-sm font-medium ${
        highlight === "success"
          ? "text-green-600"
          : highlight === "danger"
            ? "text-red-500"
            : "text-[var(--color-text-primary)]"
      }`}
    >
      {value}
    </p>
  </div>
);

export default SettingsRow