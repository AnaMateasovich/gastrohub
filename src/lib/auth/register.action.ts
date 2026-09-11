"use server";
import { RegisterType } from "@/src/app/types/register.type";
import { Resend } from "resend";
import { registerSchema } from "../validations/register.schema";
import { prisma } from "../prisma";
import bcrypt from "bcrypt"; 
import { render } from "@react-email/components";
import { createElement } from "react";
import { WelcomeEmail } from "@/src/emails/WelcomeEmail";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { after } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(companyName: string, ownerEmail: string) {
  try {
    const html = await render(
      createElement(WelcomeEmail, { name: companyName }),
    );
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ownerEmail,
      subject: "Bienvenido 🎉",
      html,
    });
  } catch (err) {
    console.error("Error enviando welcome email:", err);
  }
}

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
    after(() => sendWelcomeEmail(result.organization.name, ownerEmail));


    return result;
    redirect(
      `http://${result.organization.slug}.lvh.me:3000/login?registered=true`,
    );
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
