import Link from "next/link";

const MarketingHeader = () => {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: "rgba(246, 241, 231, 0.85)",
        borderBottom: "1px solid var(--gh-line)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-[64px]">
        <Link
          href="/"
          className="font-bold text-xl"
          style={{ fontFamily: "Fraunces, Georgia, serif", color: "var(--gh-ink)" }}
        >
          Gastro<span style={{ color: "var(--gh-green)" }}>Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/precios" className="hover:opacity-70 transition-opacity">
            Precios
          </Link>
          <Link href="/login" className="hover:opacity-70 transition-opacity">
            Ingresar
          </Link>
        </nav>

        <Link
          href="/register"
          className="px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03]"
          style={{ background: "var(--gh-ink)", color: "var(--gh-paper)" }}
        >
          Crear mi tienda
        </Link>
      </div>
    </header>
  );
};

export default MarketingHeader;