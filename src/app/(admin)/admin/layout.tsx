import { Suspense } from "react";
import NavAdmin from "../components/NavAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h4 className="font-bold text-xl p-2 ">Admin</h4>
      <Suspense>
        <NavAdmin />
      </Suspense>
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
    </div>
  );
}
