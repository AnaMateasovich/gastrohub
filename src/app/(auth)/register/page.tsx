import RegisterComponent from "@/src/app/(auth)/components/RegisterComponent";
import Link from "next/link";
import { ClipboardList, Package, Users } from "lucide-react";

const PERKS = [
  { icon: Package, label: "Catálogo de productos ilimitado" },
  { icon: ClipboardList, label: "Pedidos y seguimiento en tiempo real" },
  { icon: Users, label: "Roles y permisos por empleado" },
];

const Page = () => {
  return (
    <section className="min-h-screen grid md:grid-cols-2">
      {/* Panel de marca — solo desktop */}
      <div
        className="hidden md:flex flex-col justify-between p-12"
        style={{ background: "#241A12", color: "#F6F1E7" }}
      >
        <div>
          <Link
            href="/"
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Gastro<span style={{ color: "#1E6F5C" }}>Hub</span>
          </Link>

          <h2
            className="mt-16 font-bold leading-tight"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            }}
          >
            Tu negocio,
            <br />
            con tienda propia.
          </h2>

          <p className="mt-4 opacity-70 max-w-xs leading-relaxed">
            En minutos tenés tu subdominio, tu catálogo y tu panel de administración.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {PERKS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm opacity-85">
              <Icon size={18} style={{ color: "#1E6F5C" }} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Panel de form */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <div className="md:hidden text-center">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                color: "#241A12",
              }}
            >
              Gastro<span style={{ color: "#1E6F5C" }}>Hub</span>
            </Link>
          </div>

          <div className="text-center md:text-left">
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                color: "#241A12",
              }}
            >
              Creá tu cuenta
            </h1>
            <p className="mt-1 opacity-60 text-sm">
              Empezá gratis, sin tarjeta de crédito.
            </p>
          </div>

          <RegisterComponent />

          <p className="text-center text-sm opacity-70">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "#1E6F5C" }}>
              Ingresá
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page;