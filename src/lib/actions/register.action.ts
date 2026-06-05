"use server"
import { RegisterType } from "@/src/app/types/register.type";
import { Resend } from "resend";
import { registerSchema } from "../validations/register.schema";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { render } from "@react-email/components";
import { createElement } from "react";
import { WelcomeEmail } from "@/src/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUser(data: RegisterType) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) throw new Error("El email ya está registrado");

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: { ...parsed.data, password: hashedPassword },
  });

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "anamateasovich98@gmail.com",
    subject: "Bienvenido 🎉",
      html: await render(createElement(WelcomeEmail, { name: user.name })),
  });

  return user;
}
