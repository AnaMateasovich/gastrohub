"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SCROLL_TO_TOP_ROUTES = ["/home", "/perfil"];
export default function ScrollToTop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (SCROLL_TO_TOP_ROUTES.includes(pathname)) {
    ref.current?.scrollTo(0, 0);
  }
}, [pathname]);


  return (
    <div ref={ref} className="flex-1 overflow-y-auto pb-16">
      {children}
    </div>
  );
}