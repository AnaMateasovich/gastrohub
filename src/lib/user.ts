"use server";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { RegisterType } from "../app/types/register.type";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function createUser({
  email,
  password,
  name,
  lastname,
  phone,
  address,
}: RegisterType) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      lastname,
      phone,
      address,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("token", token)
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      omit: { password: true },
    });

    return user;
  } catch (error) {
    console.error("getUser error:", error);
    return null;
  }
}
