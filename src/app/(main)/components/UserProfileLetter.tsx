"use client";
import { useUser } from "@/src/contexts/UserContext";
import { getHash, userColors } from "@/src/utils/user";
import React from "react";

const UserProfileLetter = () => {
  const { user } = useUser();

  if (!user) return null;

  const firstLetter = user?.name.charAt(0);
  const hash = getHash(user.email)
  const color = userColors[hash % userColors.length]

  return (
    <div
      style={{ backgroundColor: color! }}
      className="text-3xl font-bold py-5 px-7 rounded-full"
    >
      {firstLetter}
    </div>
  );
};

export default UserProfileLetter;
