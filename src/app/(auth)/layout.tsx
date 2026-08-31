import type { CSSProperties } from "react";

const authVars = {
  "--color-primary": "#1E6F5C",
  "--color-primary-dark": "#154F42",
  "--color-card": "#FFFDF8",
  "--color-background": "#F6F1E7",
  "--color-text-primary": "#241A12",
} as CSSProperties;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        ...authVars,
        background: "var(--color-background)",
        minHeight: "100vh",
        fontFamily: "var(--font-fraunces), Georgia, serif",
      }}
    >
      {children}
    </div>
  );
}
