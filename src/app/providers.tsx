import { Toaster } from "sonner";
import CartProvider from "../contexts/CartContext";
import { UserProvider } from "../contexts/UserContext";
import { getSession } from "../lib/auth/get-session";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <>
    <Toaster richColors position="top-right" />
    <UserProvider initialUser={user}>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
    </>
  );
}
