"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserType } from "../app/types/user.type";
import { useRouter } from "next/navigation";

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  handleLogout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserType | null;
}) => {
  const [user, setUser] = useState<UserType | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  console.log("user", user);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Error al cerrar sesión");
      }
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};
