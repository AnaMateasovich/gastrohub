import ProductProvider from "@/src/contexts/ProductContext";
import NavAdmin from "../components/NavAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProductProvider>
      <div className="flex flex-col h-full overflow-hidden">
        <h4 className="font-bold text-xl p-2 ">Admin</h4>

        <NavAdmin />
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      </div>
    </ProductProvider>
  );
}
