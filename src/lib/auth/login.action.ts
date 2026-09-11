"use server";
import { LoginType } from "@/src/app/types/login.type";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { loginSchema } from "../validations/login.schema";
import { getCurrentTenant } from "../tenant/tenant";

export async function login(data: LoginType) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));

  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("Organización no encontrada");
  }
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      memberships: {
        where: {
          organizationId: tenant.id,
          status: "ACTIVE"
        },
      },
    },
  });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const membership = user.memberships[0];

  if (!membership) {
    throw new Error("Credenciales inválidas");
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) throw new Error("Credenciales inválidas");

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    {
      userId: user.id,
      organizationId: membership.organizationId,
      role: membership.role,
      organizationSlug: tenant.slug
    },
    secret,
    { expiresIn: "1d" },
  );

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const { password: _, memberships, ...safeUser } = user;
  return safeUser;
}
