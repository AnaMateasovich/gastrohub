import { Suspense } from "react";
import NavAdmin from "../components/NavAdmin";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full overflow-hidden">
      <Suspense>
        <NavAdmin />
      </Suspense>
      <main className="h-full overflow-y-auto pb-20 md:pb-0 md:pl-[70px] mt-4 mx-4">
        {children}
        <Toaster richColors position="top-right" />

      </main>
    </div>
  );
}