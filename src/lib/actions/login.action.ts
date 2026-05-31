"use server";
import { LoginType } from "@/src/app/types/login.type";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { loginSchema } from "../validations/login.schema";

export async function login(data: LoginType) {
  
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error("Credenciales inválidas");

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) throw new Error("Credenciales inválidas");

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
