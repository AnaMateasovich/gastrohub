import { Toaster } from "sonner";
import CartProvider from "../contexts/CartContext";
import { UserProvider } from "../contexts/UserContext";
import { getUser } from "../lib/user";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
    <Toaster richColors position="top-right" />
    <UserProvider initialUser={user}>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
    </>
  );
}
