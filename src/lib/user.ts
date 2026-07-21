"use server";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { RegisterType } from "../app/types/register.type";

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
