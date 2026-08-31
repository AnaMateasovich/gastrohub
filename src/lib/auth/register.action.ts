"use server";
import { RegisterType } from "@/src/app/types/register.type";
import { Resend } from "resend";
import { registerSchema } from "../validations/register.schema";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { render } from "@react-email/components";
import { createElement } from "react";
import { WelcomeEmail } from "@/src/emails/WelcomeEmail";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerOrganization(data: RegisterType) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));

  const { companyName, slug, ownerName, ownerEmail, ownerPassword, plan } =
    parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });
  if (existingUser) throw new Error("El email ya está registrado");

  const existingOrganization = await prisma.organization.findUnique({
    where: {
      slug,
    },
  });

  if (existingOrganization) {
    throw new Error("Ese subdominio ya está en uso");
  }

  const hashedPassword = await bcrypt.hash(ownerPassword, 10);

  try {
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.create({
          data: {
            name: ownerName,
            email: ownerEmail,
            password: hashedPassword,
          },
        });

        const organization = await tx.organization.create({
          data: {
            name: companyName,
            slug,
            plan,
            subscriptionStatus: "TRIALING",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });

        const membership = await tx.membership.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
            role: "ADMIN",
          },
        });

        return {
          user,
          organization,
          membership,
        };
      },
    );

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "anamateasovich98@gmail.com",
      subject: "Bienvenido 🎉",
      html: await render(createElement(WelcomeEmail, { name: companyName })),
    });

    redirect(
      `https://${result.organization.slug}.lvh.me:3000/login?registered=true`,
    );
    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Ese email o subdominio ya está en uso");
    }
    throw error;
  }
}
