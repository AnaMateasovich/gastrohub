import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // ─── Usuarios ────────────────────────────────────────────────────────────

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

  const clientesData = [
    { name: "Ana", lastname: "García", email: "cliente@cliente.com", phone: "3413000001", address: "Av. Siempreviva 742, Rosario" },
    { name: "Carlos", lastname: "Pérez", email: "carlos@cliente.com", phone: "3413000002", address: "San Martín 123, Rosario" },
    { name: "María", lastname: "López", email: "maria@cliente.com", phone: "3413000003", address: "Mitre 456, Casilda" },
    { name: "Juan", lastname: "Rodríguez", email: "juan@cliente.com", phone: "3413000004", address: "Belgrano 789, Casilda" },
    { name: "Lucía", lastname: "Fernández", email: "lucia@cliente.com", phone: "3413000005", address: "Pellegrini 234, Rosario" },
    { name: "Martín", lastname: "Sosa", email: "martin@cliente.com", phone: "3413000006", address: "Urquiza 567, Casilda" },
  ];

  const clientes = [];
  for (const c of clientesData) {
    const cliente = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        ...c,
        password: await bcrypt.hash("cliente123", 10),
        role: "USER",
      },
    });
    clientes.push(cliente);
  }

  console.log(`${clientes.length} clientes creados`);

  // ─── Configuración de la tienda ──────────────────────────────────────────

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      deliveryFee: 500,
      freeDeliveryFrom: 5000,
      minimumOrderAmount: 1000,
      storeOpen: true,
      openingTime: "09:00",
      closingTime: "20:00",
      whatsappPhone: "5493413000000",
      storeEmail: "hola@saboresnaturales.com",
      instagramUrl: "https://instagram.com/saboresnaturales",
      allowGuestCheckout: true,
      enableCoupons: true,
      maxDiscountPercentage: 20,
      announcementBar: "Envío gratis en compras mayores a $5.000",
      maintenanceMode: false,
    },
  });

  console.log("Configuración de la tienda creada");

  // ─── Ingredientes ────────────────────────────────────────────────────────

  const ingredientesData = [
    { name: "Harina de almendras", unit: "kg", price: 6000 },
    { name: "Huevo", unit: "u", price: 160 },
    { name: "Banana", unit: "kg", price: 800 },
    { name: "Leche de coco", unit: "l", price: 2200 },
    { name: "Aceite de coco", unit: "l", price: 3500 },
    { name: "Avena", unit: "kg", price: 1200 },
    { name: "Harina de tapioca", unit: "kg", price: 1800 },
    { name: "Queso cremoso", unit: "kg", price: 4500 },
    { name: "Miel", unit: "kg", price: 5000 },
    { name: "Semillas de chía", unit: "kg", price: 2900 },
    { name: "Cacao amargo", unit: "kg", price: 4200 },
    { name: "Manteca de maní", unit: "kg", price: 3800 },
  ];

  const ingredientes: Record<string, { id: number }> = {};
  for (const ing of ingredientesData) {
    const created = await prisma.ingredient.create({ data: ing });
    ingredientes[ing.name] = created;
  }

  console.log(`${ingredientesData.length} ingredientes creados`);

  // ─── Recetas ─────────────────────────────────────────────────────────────

  const recetaWaffle = await prisma.recipe.create({
    data: {
      name: "Waffle de almendras",
      yield: 4,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: ingredientes["Harina de almendras"].id, quantity: 0.2, unit: "kg" },
          { ingredientId: ingredientes["Huevo"].id, quantity: 3, unit: "u" },
          { ingredientId: ingredientes["Leche de coco"].id, quantity: 0.1, unit: "l" },
          { ingredientId: ingredientes["Aceite de coco"].id, quantity: 0.03, unit: "l" },
        ],
      },
    },
  });

  const recetaPrepizza = await prisma.recipe.create({
    data: {
      name: "Prepizza sin gluten",
      yield: 2,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: ingredientes["Harina de tapioca"].id, quantity: 0.25, unit: "kg" },
          { ingredientId: ingredientes["Huevo"].id, quantity: 2, unit: "u" },
          { ingredientId: ingredientes["Aceite de coco"].id, quantity: 0.02, unit: "l" },
          { ingredientId: ingredientes["Queso cremoso"].id, quantity: 0.1, unit: "kg" },
        ],
      },
    },
  });

  const recetaSandwich = await prisma.recipe.create({
    data: {
      name: "Pan de sandwich",
      yield: 6,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: ingredientes["Avena"].id, quantity: 0.15, unit: "kg" },
          { ingredientId: ingredientes["Harina de tapioca"].id, quantity: 0.1, unit: "kg" },
          { ingredientId: ingredientes["Huevo"].id, quantity: 2, unit: "u" },
          { ingredientId: ingredientes["Banana"].id, quantity: 0.1, unit: "kg" },
          { ingredientId: ingredientes["Aceite de coco"].id, quantity: 0.02, unit: "l" },
        ],
      },
    },
  });

  const recetaBrownie = await prisma.recipe.create({
    data: {
      name: "Brownie fit",
      yield: 8,
      yieldUnit: "u",
      items: {
        create: [
          { ingredientId: ingredientes["Cacao amargo"].id, quantity: 0.15, unit: "kg" },
          { ingredientId: ingredientes["Banana"].id, quantity: 0.3, unit: "kg" },
          { ingredientId: ingredientes["Huevo"].id, quantity: 3, unit: "u" },
          { ingredientId: ingredientes["Manteca de maní"].id, quantity: 0.1, unit: "kg" },
          { ingredientId: ingredientes["Miel"].id, quantity: 0.08, unit: "kg" },
        ],
      },
    },
  });

  const recetaGranola = await prisma.recipe.create({
    data: {
      name: "Granola casera",
      yield: 1,
      yieldUnit: "kg",
      items: {
        create: [
          { ingredientId: ingredientes["Avena"].id, quantity: 0.6, unit: "kg" },
          { ingredientId: ingredientes["Miel"].id, quantity: 0.15, unit: "kg" },
          { ingredientId: ingredientes["Semillas de chía"].id, quantity: 0.1, unit: "kg" },
          { ingredientId: ingredientes["Aceite de coco"].id, quantity: 0.05, unit: "l" },
        ],
      },
    },
  });

  console.log("5 recetas creadas");

  // ─── Productos ───────────────────────────────────────────────────────────

  const productosData = [
    {
      name: "Waffle de almendras",
      slug: "waffle-almendras",
      description: "Waffle sin gluten hecho con harina de almendras, ideal para un desayuno saludable.",
      price: 1800,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaWaffle.id,
      image: "/products/waffle-almendras.webp",
    },
    {
      name: "Waffle clásico",
      slug: "waffle-clasico",
      description: "Nuestro waffle clásico, esponjoso y dorado. Ideal para el desayuno o la merienda.",
      price: 1500,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaWaffle.id,
      image: "/products/waffle.jpeg",
    },
    {
      name: "Prepizza sin gluten",
      slug: "prepizza-sin-gluten",
      description: "Base de pizza sin TACC, lista para usar. Crocante por fuera y tierna por dentro.",
      price: 2200,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaPrepizza.id,
      image: "/products/prepizza.jpeg",
    },
    {
      name: "Pan de sandwich",
      slug: "pan-sandwich",
      description: "Pan saludable de avena y banana, perfecto para armar sándwiches nutritivos.",
      price: 2800,
      saleUnit: "u",
      saleAmount: 6,
      recipeId: recetaSandwich.id,
      image: "/products/sandwich.jpeg",
    },
    {
      name: "Brownie fit",
      slug: "brownie-fit",
      description: "Brownie sin azúcar refinada, endulzado con miel y banana. Intenso sabor a cacao.",
      price: 1600,
      saleUnit: "u",
      saleAmount: 1,
      recipeId: recetaBrownie.id,
      image: "/products/brownie.png",
    },
    {
      name: "Granola casera",
      slug: "granola-casera",
      description: "Granola artesanal con avena, miel y semillas de chía. Perfecta con yogur o leche.",
      price: 3200,
      saleUnit: "kg",
      saleAmount: 0.5,
      recipeId: recetaGranola.id,
      image: "/products/granola.webp",
    },
  ];

  const productos: Record<string, { id: number }> = {};
  for (const p of productosData) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        isActive: true,
        saleUnit: p.saleUnit,
        saleAmount: p.saleAmount,
        recipeId: p.recipeId,
        images: { create: [{ url: p.image, position: 0 }] },
      },
    });
    productos[p.slug] = created;
  }

  console.log(`${productosData.length} productos creados`);

  // ─── Pedidos ─────────────────────────────────────────────────────────────
  // Variedad de estados, clientes registrados y anónimos, con y sin envío

  await prisma.orders.create({
    data: {
      customerName: "Ana",
      customerLastname: "García",
      email: "cliente@cliente.com",
      phone: "3413000001",
      address: "Av. Siempreviva 742, Rosario",
      status: "PENDING",
      userId: clientes[0].id,
      subtotal: 5800,
      total: 6300,
      deliveryFee: 500,
      discount: 0,
      orderItems: {
        create: [
          { productId: productos["waffle-almendras"].id, quantity: 2, price: 1800 },
          { productId: productos["prepizza-sin-gluten"].id, quantity: 1, price: 2200 },
        ],
      },
    },
  });

  await prisma.orders.create({
    data: {
      customerName: "Carlos",
      customerLastname: "Pérez",
      email: "carlos@cliente.com",
      phone: "3413000002",
      address: "San Martín 123, Rosario",
      status: "PREPARING",
      userId: clientes[1].id,
      subtotal: 5600,
      total: 5600,
      deliveryFee: 0,
      discount: 0,
      orderItems: {
        create: [{ productId: productos["pan-sandwich"].id, quantity: 2, price: 2800 }],
      },
    },
  });

  await prisma.orders.create({
    data: {
      customerName: "María",
      customerLastname: "López",
      email: "maria@cliente.com",
      phone: "3413000003",
      address: "Mitre 456, Casilda",
      status: "READY",
      userId: clientes[2].id,
      subtotal: 6600,
      total: 6600,
      deliveryFee: 0,
      discount: 0,
      orderItems: {
        create: [{ productId: productos["prepizza-sin-gluten"].id, quantity: 3, price: 2200 }],
      },
    },
  });

  await prisma.orders.create({
    data: {
      customerName: "Juan",
      customerLastname: "Rodríguez",
      email: "juan@cliente.com",
      phone: "3413000004",
      address: "Belgrano 789, Casilda",
      status: "SHIPPED",
      userId: clientes[3].id,
      subtotal: 7200,
      total: 7700,
      deliveryFee: 500,
      discount: 0,
      orderItems: {
        create: [{ productId: productos["waffle-almendras"].id, quantity: 4, price: 1800 }],
      },
    },
  });

  await prisma.orders.create({
    data: {
      customerName: "Lucía",
      customerLastname: "Fernández",
      email: "lucia@cliente.com",
      phone: "3413000005",
      address: "Pellegrini 234, Rosario",
      status: "PICKEDUP",
      userId: clientes[4].id,
      subtotal: 4800,
      total: 4800,
      deliveryFee: 0,
      discount: 480,
      orderItems: {
        create: [
          { productId: productos["brownie-fit"].id, quantity: 2, price: 1600 },
          { productId: productos["granola-casera"].id, quantity: 1, price: 3200 },
        ],
      },
    },
  });

  await prisma.orders.create({
    data: {
      customerName: "Martín",
      customerLastname: "Sosa",
      email: "martin@cliente.com",
      phone: "3413000006",
      address: "Urquiza 567, Casilda",
      status: "CANCELLED",
      userId: clientes[5].id,
      subtotal: 2200,
      total: 2200,
      deliveryFee: 0,
      discount: 0,
      orderItems: {
        create: [{ productId: productos["prepizza-sin-gluten"].id, quantity: 1, price: 2200 }],
      },
    },
  });

  // Pedidos anónimos (venta directa en el local)
  await prisma.orders.create({
    data: {
      customerName: "Anónimo",
      customerLastname: "Anónimo",
      email: "anonimo@anonimo.com",
      phone: "S/D",
      address: "Retiro en local",
      status: "PICKEDUP",
      userId: null,
      subtotal: 3300,
      total: 3300,
      deliveryFee: 0,
      discount: 0,
      orderItems: {
        create: [
          { productId: productos["waffle-clasico"].id, quantity: 1, price: 1500 },
          { productId: productos["brownie-fit"].id, quantity: 1, price: 1600 },
        ],
      },
    },
  });

  await prisma.orders.create({
    data: {
      customerName: "Anónimo",
      customerLastname: "Anónimo",
      email: "anonimo@anonimo.com",
      phone: "S/D",
      address: "Retiro en local",
      status: "READY",
      userId: null,
      subtotal: 4400,
      total: 4400,
      deliveryFee: 0,
      discount: 0,
      orderItems: {
        create: [{ productId: productos["granola-casera"].id, quantity: 1, price: 3200 }],
      },
    },
  });

  console.log("8 pedidos creados");
  console.log("Seed completado con éxito");
}

main()
  .catch((e) => {
    console.error("Error al ejecutar el seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());