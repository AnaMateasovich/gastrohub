import { PrismaClient, Prisma, Role, Orders_status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "123456";

async function main() {
  const password = await bcrypt.hash(PASSWORD, 10);

  // ───────────────────────────────────────────────
  // ORG A: Panadería Sabores (la "principal", con más data)
  // ───────────────────────────────────────────────
  const orgA = await prisma.organization.upsert({
    where: { slug: "sabores" },
    update: {},
    create: {
      name: "Sabores Naturales",
      slug: "sabores",
      plan: "pro",
    },
  });

  const ownerA = await prisma.user.upsert({
    where: { email: "owner@sabores.com" },
    update: {},
    create: { email: "owner@sabores.com", password },
  });

  const adminA = await prisma.user.upsert({
    where: { email: "admin@sabores.com" },
    update: {},
    create: { email: "admin@sabores.com", password },
  });

  const staffA = await prisma.user.upsert({
    where: { email: "staff@sabores.com" },
    update: {},
    create: { email: "staff@sabores.com", password },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: ownerA.id, organizationId: orgA.id } },
    update: {},
    create: { userId: ownerA.id, organizationId: orgA.id, role: Role.OWNER },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: adminA.id, organizationId: orgA.id } },
    update: {},
    create: { userId: adminA.id, organizationId: orgA.id, role: Role.ADMIN },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: staffA.id, organizationId: orgA.id } },
    update: {},
    create: { userId: staffA.id, organizationId: orgA.id, role: Role.STAFF },
  });

  await prisma.storeSettings.upsert({
    where: { organizationId: orgA.id },
    update: {},
    create: {
      organizationId: orgA.id,
      deliveryFee: new Prisma.Decimal(1000),
      freeDeliveryFrom: new Prisma.Decimal(20000),
      minimumOrderAmount: new Prisma.Decimal(0),
      storeOpen: true,
      allowGuestCheckout: true,
      enableCoupons: true,
      whatsappPhone: "3464555111",
      storeEmail: "hola@sabores.com",
    },
  });

  // Ingrediente + receta + producto (para testear el costeo)
  const harina = await prisma.ingredient.create({
    data: {
      organizationId: orgA.id,
      name: "Harina 0000",
      unit: "kg",
      price: new Prisma.Decimal(800),
      stock: new Prisma.Decimal(50),
    },
  });

  const recetaMedialunas = await prisma.recipe.create({
    data: {
      organizationId: orgA.id,
      name: "Medialunas x12",
      yield: new Prisma.Decimal(12),
      yieldUnit: "unidades",
      items: {
        create: [{ ingredientId: harina.id, quantity: new Prisma.Decimal(1), unit: "kg" }],
      },
    },
  });

  const productos = await Promise.all([
    prisma.product.create({
      data: {
        organizationId: orgA.id,
        name: "Medialunas de manteca",
        slug: "medialunas-manteca",
        price: 3500,
        saleAmount: new Prisma.Decimal(12),
        saleUnit: "docena",
        stock: 30,
        recipeId: recetaMedialunas.id,
      },
    }),
    prisma.product.create({
      data: {
        organizationId: orgA.id,
        name: "Pan de campo",
        slug: "pan-de-campo",
        price: 2200,
        saleAmount: new Prisma.Decimal(1),
        saleUnit: "u",
        stock: 20,
      },
    }),
    prisma.product.create({
      data: {
        organizationId: orgA.id,
        name: "Torta de chocolate",
        slug: "torta-chocolate",
        price: 8500,
        saleAmount: new Prisma.Decimal(1),
        saleUnit: "unidad",
        stock: 5,
      },
    }),
  ]);

  const clientesA = await Promise.all([
    prisma.customer.create({
      data: {
        organizationId: orgA.id,
        name: "Lucía",
        lastname: "Gómez",
        email: "lucia@test.com",
        phone: "3464111111",
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: orgA.id,
        name: "Martín",
        lastname: "Pereyra",
        email: "martin@test.com",
        phone: "3464222222",
      },
    }),
  ]);

  // Pedidos con distintos estados (para filtros de UI y tests de flujo)
  const estados: Orders_status[] = [
    Orders_status.PENDING,
    Orders_status.PREPARING,
    Orders_status.READY,
    Orders_status.SHIPPED,
    Orders_status.PICKEDUP,
    Orders_status.CANCELLED,
  ];

  for (const [i, status] of estados.entries()) {
    const cliente = clientesA[i % clientesA.length];
    await prisma.order.create({
      data: {
        organizationId: orgA.id,
        customerId: cliente.id,
        customerName: cliente.name ?? "Cliente",
        customerLastname: cliente.lastname ?? "Test",
        phone: cliente.phone ?? "3464000000",
        email: cliente.email,
        address: "Calle Falsa 123",
        status,
        subtotal: new Prisma.Decimal(3500),
        total: new Prisma.Decimal(4500),
        deliveryFee: new Prisma.Decimal(1000),
        orderItems: {
          create: [{ productId: productos[i % productos.length].id, quantity: 1, price: 3500 }],
        },
      },
    });
  }

  await prisma.coupon.upsert({
    where: { organizationId_code: { organizationId: orgA.id, code: "BIENVENIDA10" } },
    update: {},
    create: {
      organizationId: orgA.id,
      code: "BIENVENIDA10",
      percentage: 10,
      maxUses: 100,
    },
  });

  // ───────────────────────────────────────────────
  // ORG B: Otra Pastelería (SOLO para testear aislamiento multi-tenant)
  // Este user/org NUNCA debería ver nada de Org A, ni viceversa.
  // ───────────────────────────────────────────────
  const orgB = await prisma.organization.upsert({
    where: { slug: "otra-pasteleria" },
    update: {},
    create: {
      name: "Otra Pastelería",
      slug: "otra-pasteleria",
      plan: "free",
    },
  });

  const ownerB = await prisma.user.upsert({
    where: { email: "owner@otrapasteleria.com" },
    update: {},
    create: { email: "owner@otrapasteleria.com", password },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: ownerB.id, organizationId: orgB.id } },
    update: {},
    create: { userId: ownerB.id, organizationId: orgB.id, role: Role.OWNER },
  });

  await prisma.storeSettings.upsert({
    where: { organizationId: orgB.id },
    update: {},
    create: {
      organizationId: orgB.id,
      deliveryFee: new Prisma.Decimal(500),
      storeOpen: true,
    },
  });

  const productoB = await prisma.product.create({
    data: {
      organizationId: orgB.id,
      name: "Alfajores de maicena",
      slug: "alfajores-maicena",
      price: 4000,
      saleAmount: new Prisma.Decimal(6),
      saleUnit: "docena",
      stock: 15,
    },
  });

  const clienteB = await prisma.customer.create({
    data: {
      organizationId: orgB.id,
      name: "Sofía",
      lastname: "Ruiz",
      email: "sofia@test.com",
      phone: "3464333333",
    },
  });

  await prisma.order.create({
    data: {
      organizationId: orgB.id,
      customerId: clienteB.id,
      customerName: "Sofía",
      customerLastname: "Ruiz",
      phone: "3464333333",
      email: "sofia@test.com",
      address: "Otra Calle 456",
      status: Orders_status.PENDING,
      subtotal: new Prisma.Decimal(4000),
      total: new Prisma.Decimal(4000),
      orderItems: { create: [{ productId: productoB.id, quantity: 1, price: 4000 }] },
    },
  });

  console.log("✅ Seed completada\n");
  console.log("── Credenciales de test (password para todos: 123456) ──");
  console.log(`Org A "sabores"       → OWNER: owner@sabores.com`);
  console.log(`Org A "sabores"       → ADMIN: admin@sabores.com`);
  console.log(`Org A "sabores"       → STAFF: staff@sabores.com`);
  console.log(`Org B "otra-pasteleria" → OWNER: owner@otrapasteleria.com`);
  console.log(`\nOrg IDs → A: ${orgA.id} | B: ${orgB.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });