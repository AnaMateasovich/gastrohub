"use server"
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { RegisterType } from "../app/types/register.type";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function createUser({
  email,
  password,
  name,
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
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      omit: { password: true },
    });

    return user;
  } catch {
    return null;
  }
}