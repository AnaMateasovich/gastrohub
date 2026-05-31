import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password,
      role: "ADMIN",
    },
  });

  //Client
  await prisma.user.upsert({
  where: { email: "cliente@cliente.com" },
  update: {},
  create: {
    name: "Ana García",
    email: "cliente@cliente.com",
    password: await bcrypt.hash("cliente123", 10),
    role: "USER",
    phone: "3413000001",
    address: "Av. Siempreviva 742, Rosario",
  },
});

  // Settings
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      deliveryFee: 500,
      freeDeliveryFrom: 5000,
      minimumOrderAmount: 1000,
      storeOpen: true,
      whatsappPhone: "5493413000000",
      allowGuestCheckout: true,
      enableCoupons: false,
    },
  });

  // Ingredientes
  const harina = await prisma.ingredient.create({
    data: { name: "Harina de almendras", unit: "kg", price: 6000 },
  });
  const huevo = await prisma.ingredient.create({
    data: { name: "Huevo", unit: "u", price: 160 },
  });
  const banana = await prisma.ingredient.create({
    data: { name: "Banana", unit: "kg", price: 800 },
  });
  const leche = await prisma.ingredient.create({
    data: { name: "Leche de coco", unit: "l", price: 2200 },
  });
  const aceite = await prisma.ingredient.create({
    data: { name: "Aceite de coco", unit: "l", price: 3500 },
  });
  const avena = await prisma.ingredient.create({
    data: { name: "Avena", unit: "kg", price: 1200 },
  });
  const harinaTapioca = await prisma.ingredient.create({
    data: { name: "Harina de tapioca", unit: "kg", price: 1800 },
  });
  const queso = await prisma.ingredient.create({
    data: { name: "Queso cremoso", unit: "kg", price: 4500 },
  });

  // Receta waffle almendras
  const recetaWaffle = await prisma.recipe.create({
    data: {
      name: "Waffle de almendras",
      yield: 4,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: harina.id, quantity: 0.2, unit: "kg" },
          { ingredientId: huevo.id, quantity: 3, unit: "u" },
          { ingredientId: leche.id, quantity: 0.1, unit: "l" },
          { ingredientId: aceite.id, quantity: 0.03, unit: "l" },
        ],
      },
    },
  });

  // Receta prepizza
  const recetaPrepizza = await prisma.recipe.create({
    data: {
      name: "Prepizza sin gluten",
      yield: 2,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: harinaTapioca.id, quantity: 0.25, unit: "kg" },
          { ingredientId: huevo.id, quantity: 2, unit: "u" },
          { ingredientId: aceite.id, quantity: 0.02, unit: "l" },
          { ingredientId: queso.id, quantity: 0.1, unit: "kg" },
        ],
      },
    },
  });

  // Receta sandwich
  const recetaSandwich = await prisma.recipe.create({
    data: {
      name: "Pan de sandwich",
      yield: 6,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: avena.id, quantity: 0.15, unit: "kg" },
          { ingredientId: harinaTapioca.id, quantity: 0.1, unit: "kg" },
          { ingredientId: huevo.id, quantity: 2, unit: "u" },
          { ingredientId: banana.id, quantity: 0.1, unit: "kg" },
          { ingredientId: aceite.id, quantity: 0.02, unit: "l" },
        ],
      },
    },
  });

  // Productos
  await prisma.product.create({
    data: {
      name: "Waffle de almendras",
      slug: "waffle-almendras",
      description: "Waffle sin gluten hecho con harina de almendras, ideal para un desayuno saludable.",
      price: 1800,
      isActive: true,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaWaffle.id,
      images: {
        create: [{ url: "/products/waffle-almendras.webp", position: 0 }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Prepizza sin gluten",
      slug: "prepizza-sin-gluten",
      description: "Base de pizza sin TACC, lista para usar. Crocante por fuera y tierna por dentro.",
      price: 2200,
      isActive: true,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaPrepizza.id,
      images: {
        create: [{ url: "/products/prepizza.jpeg", position: 0 }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Pan de sandwich",
      slug: "pan-sandwich",
      description: "Pan saludable de avena y banana, perfecto para armar sándwiches nutritivos.",
      price: 2800,
      isActive: true,
      saleUnit: "u",
      saleAmount: 6,
      recipeId: recetaSandwich.id,
      images: {
        create: [{ url: "/products/sandwich.jpeg", position: 0 }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Waffle clásico",
      slug: "waffle-clasico",
      description: "Nuestro waffle clásico, esponjoso y dorado. Ideal para el desayuno o la merienda.",
      price: 1500,
      isActive: true,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaWaffle.id,
      images: {
        create: [{ url: "/products/waffle.jpeg", position: 0 }],
      },
    },
  });

  console.log("Seed completado");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());