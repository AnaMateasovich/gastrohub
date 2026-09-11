import {
  PrismaClient,
  Prisma,
  Role,
  Orders_status,
  PlanTier,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const PASSWORD = "123456";

async function main() {
  const password = await bcrypt.hash(PASSWORD, 10);

  // ───────────────────────────────────────────────
  // ORG A: Panadería Sabores
  // ───────────────────────────────────────────────

  const orgA = await prisma.organization.upsert({
    where: { slug: "sabores" },
    update: {},
    create: {
      name: "Sabores Naturales",
      slug: "sabores",
      plan: PlanTier.PRO,
      subscriptionStatus: "ACTIVE",
    },
  });

  // ───────────────────────────────────────────────
  // USERS ORG A
  // ───────────────────────────────────────────────

  const ownerA = await prisma.user.upsert({
    where: { email: "owner@sabores.com" },
    update: {},
    create: {
      email: "owner@sabores.com",
      name: "Owner Sabores",
      password,
    },
  });

  const adminA = await prisma.user.upsert({
    where: { email: "admin@sabores.com" },
    update: {},
    create: {
      email: "admin@sabores.com",
      name: "Admin Sabores",
      password,
    },
  });

  const staffA = await prisma.user.upsert({
    where: { email: "staff@sabores.com" },
    update: {},
    create: {
      email: "staff@sabores.com",
      name: "Staff Sabores",
      password,
    },
  });

  // ───────────────────────────────────────────────
  // MEMBERSHIPS ORG A
  // ───────────────────────────────────────────────

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: ownerA.id,
        organizationId: orgA.id,
      },
    },
    update: {},
    create: {
      userId: ownerA.id,
      organizationId: orgA.id,
      role: Role.OWNER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: adminA.id,
        organizationId: orgA.id,
      },
    },
    update: {},
    create: {
      userId: adminA.id,
      organizationId: orgA.id,
      role: Role.ADMIN,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: staffA.id,
        organizationId: orgA.id,
      },
    },
    update: {},
    create: {
      userId: staffA.id,
      organizationId: orgA.id,
      role: Role.STAFF,
    },
  });

  // Segundo OWNER de la org A: a diferencia de ownerA (dueño fundador,
  // creado por registerOrganization sin Employee asociado), este usuario
  // representa a alguien invitado con rol OWNER a través del flujo de
  // empleados (inviteEmployeeAccess) — por eso sí tiene un Employee
  // vinculado más abajo, igual que un ADMIN o STAFF invitado.
  const owner2A = await prisma.user.upsert({
    where: { email: "owner2@sabores.com" },
    update: {},
    create: {
      email: "owner2@sabores.com",
      name: "Segunda Dueña Sabores",
      password,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: owner2A.id,
        organizationId: orgA.id,
      },
    },
    update: {},
    create: {
      userId: owner2A.id,
      organizationId: orgA.id,
      role: Role.OWNER,
    },
  });

  // ───────────────────────────────────────────────
  // STORE SETTINGS ORG A
  // ───────────────────────────────────────────────

  await prisma.storeSettings.upsert({
    where: {
      organizationId: orgA.id,
    },
    update: {},
    create: {
      organizationId: orgA.id,

      organizationName: "Sabores Naturales",

      storeDescription:
        "Panadería artesanal con productos frescos y elaborados con ingredientes de calidad.",

      deliveryFee: new Prisma.Decimal(1000),
      freeDeliveryFrom: new Prisma.Decimal(20000),
      minimumOrderAmount: new Prisma.Decimal(0),

      storeOpen: true,
      openingTime: "08:00",
      closingTime: "20:00",

      whatsappPhone: "3464555111",
      storeEmail: "hola@sabores.com",
      instagramUrl: "https://instagram.com/saboresnaturales.casilda",

      city: "Casilda",
      province: "Santa Fe",
      address: "Calle Falsa 123",

      allowGuestCheckout: true,
      enableCoupons: true,
      maxDiscountPercentage: 30,

      announcementBar: "🚚 Envío gratis en compras superiores a $20.000.",

      maintenanceMode: false,

      heroImageUrl: "/hero-default.webp",
      heroBadgeText: "Panadería Artesanal",
      heroTitle: "Panificados frescos",
      heroHighlight: "todos los días",
      heroSubtitle:
        "Descubrí panes, facturas, tortas y productos elaborados con ingredientes de calidad.",
      ctaLabel: "Ver productos",
    },
  });

  // ───────────────────────────────────────────────
  // INGREDIENTE
  // ───────────────────────────────────────────────

  const harina = await prisma.ingredient.upsert({
    where: {
      organizationId_name: {
        organizationId: orgA.id,
        name: "Harina 000",
      },
    },
    update: {},
    create: {
      organizationId: orgA.id,
      name: "Harina 000",
      unit: "kg",
      price: new Prisma.Decimal(800),
      stock: new Prisma.Decimal(50),
    },
  });

  // ───────────────────────────────────────────────
  // RECETA
  // ───────────────────────────────────────────────

  const recetaMedialunas = await prisma.recipe.upsert({
    where: {
      organizationId_name: {
        organizationId: orgA.id,
        name: "Medialunas x12",
      },
    },
    update: {},
    create: {
      organizationId: orgA.id,
      name: "Medialunas x12",
      yield: new Prisma.Decimal(12),
      yieldUnit: "unidades",

      items: {
        create: [
          {
            ingredientId: harina.id,
            quantity: new Prisma.Decimal(1),
            unit: "kg",
          },
        ],
      },
    },
  });

  // ───────────────────────────────────────────────
  // PRODUCTOS ORG A
  // ───────────────────────────────────────────────

  const productos = await Promise.all([
    prisma.product.upsert({
      where: {
        organizationId_slug: {
          organizationId: orgA.id,
          slug: "medialunas-manteca",
        },
      },
      update: {},
      create: {
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

    prisma.product.upsert({
      where: {
        organizationId_slug: {
          organizationId: orgA.id,
          slug: "pan-de-campo",
        },
      },
      update: {},
      create: {
        organizationId: orgA.id,
        name: "Pan de campo",
        slug: "pan-de-campo",
        price: 2200,
        saleAmount: new Prisma.Decimal(1),
        saleUnit: "u",
        stock: 20,
      },
    }),

    prisma.product.upsert({
      where: {
        organizationId_slug: {
          organizationId: orgA.id,
          slug: "torta-chocolate",
        },
      },
      update: {},
      create: {
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

  // ───────────────────────────────────────────────
  // CLIENTES ORG A
  // ───────────────────────────────────────────────

  const clientesA = await Promise.all([
    prisma.customer.upsert({
      where: {
        organizationId_email: {
          organizationId: orgA.id,
          email: "lucia@test.com",
        },
      },
      update: {},
      create: {
        organizationId: orgA.id,
        name: "Lucía",
        lastname: "Gómez",
        email: "lucia@test.com",
        phone: "3464111111",
      },
    }),

    prisma.customer.upsert({
      where: {
        organizationId_email: {
          organizationId: orgA.id,
          email: "martin@test.com",
        },
      },
      update: {},
      create: {
        organizationId: orgA.id,
        name: "Martín",
        lastname: "Pereyra",
        email: "martin@test.com",
        phone: "3464222222",
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // PEDIDOS ORG A
  // ───────────────────────────────────────────────

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
    const isPickup = i % 2 === 0;

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
        total: new Prisma.Decimal(isPickup ? 3500 : 4500),
        deliveryFee: new Prisma.Decimal(isPickup ? 0 : 1000),

        orderItems: {
          create: [
            {
              productId: productos[i % productos.length].id,
              quantity: 1,
              price: new Prisma.Decimal(3500),
            },
          ],
        },
      },
    });
  }

  // ───────────────────────────────────────────────
  // CUPÓN ORG A
  // ───────────────────────────────────────────────

  await prisma.coupon.upsert({
    where: {
      organizationId_code: {
        organizationId: orgA.id,
        code: "BIENVENIDA10",
      },
    },

    update: {},

    create: {
      organizationId: orgA.id,
      code: "BIENVENIDA10",
      percentage: 10,
      maxUses: 100,
    },
  });

  // ───────────────────────────────────────────────
  // ORG B
  // Otra Pastelería
  // ───────────────────────────────────────────────

  const orgB = await prisma.organization.upsert({
    where: {
      slug: "otra-pasteleria",
    },

    update: {},

    create: {
      name: "Otra Pastelería",
      slug: "otra-pasteleria",
      plan: PlanTier.FREE,
      subscriptionStatus: "TRIALING",
    },
  });

  // ───────────────────────────────────────────────
  // USER ORG B
  // ───────────────────────────────────────────────

  const ownerB = await prisma.user.upsert({
    where: {
      email: "owner@otrapasteleria.com",
    },

    update: {},

    create: {
      email: "owner@otrapasteleria.com",
      name: "Owner Otra Pastelería",
      password,
    },
  });

  // ───────────────────────────────────────────────
  // MEMBERSHIP ORG B
  // ───────────────────────────────────────────────

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: ownerB.id,
        organizationId: orgB.id,
      },
    },

    update: {},

    create: {
      userId: ownerB.id,
      organizationId: orgB.id,
      role: Role.OWNER,
    },
  });

  // ───────────────────────────────────────────────
  // STORE SETTINGS ORG B
  // ───────────────────────────────────────────────

  await prisma.storeSettings.upsert({
    where: {
      organizationId: orgB.id,
    },

    update: {},

    create: {
      organizationId: orgB.id,

      organizationName: "Otra Pastelería",

      storeDescription:
        "Pastelería artesanal con tortas, alfajores y productos dulces.",

      deliveryFee: new Prisma.Decimal(500),
      freeDeliveryFrom: new Prisma.Decimal(15000),
      minimumOrderAmount: new Prisma.Decimal(0),

      storeOpen: true,
      openingTime: "09:00",
      closingTime: "19:00",

      whatsappPhone: "3464333333",
      storeEmail: "contacto@otrapasteleria.com",
      instagramUrl: "https://instagram.com/otrapasteleria",

      city: "Casilda",
      province: "Santa Fe",
      address: "Otra Calle 456",

      allowGuestCheckout: true,
      enableCoupons: true,
      maxDiscountPercentage: 20,

      announcementBar: "🍰 Tortas y pastelería artesanal hechas en el día.",

      maintenanceMode: false,

      heroImageUrl: "/hero-default.jpg",
      heroBadgeText: "Pastelería Artesanal",
      heroTitle: "Los mejores",
      heroHighlight: "postres caseros",
      heroSubtitle:
        "Encontrá tortas, alfajores y productos dulces preparados con recetas tradicionales.",
      ctaLabel: "Comprar ahora",
    },
  });

  // ───────────────────────────────────────────────
  // PRODUCTO ORG B
  // ───────────────────────────────────────────────

  const productoB = await prisma.product.upsert({
    where: {
      organizationId_slug: {
        organizationId: orgB.id,
        slug: "alfajores-maicena",
      },
    },
    update: {},
    create: {
      organizationId: orgB.id,
      name: "Alfajores de maicena",
      slug: "alfajores-maicena",
      price: 4000,
      saleAmount: new Prisma.Decimal(6),
      saleUnit: "docena",
      stock: 15,
    },
  });

  // ───────────────────────────────────────────────
  // CLIENTE ORG B
  // ───────────────────────────────────────────────

  const clienteB = await prisma.customer.upsert({
    where: {
      organizationId_email: {
        organizationId: orgB.id,
        email: "sofia@test.com",
      },
    },
    update: {},
    create: {
      organizationId: orgB.id,
      name: "Sofía",
      lastname: "Ruiz",
      email: "sofia@test.com",
      phone: "3464333333",
    },
  });

  // ───────────────────────────────────────────────
  // PEDIDO ORG B
  // ───────────────────────────────────────────────

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

      orderItems: {
        create: [
          {
            productId: productoB.id,
            quantity: 1,
            price: new Prisma.Decimal(4000),
          },
        ],
      },
    },
  });

  // ───────────────────────────────────────────────
  // ROLES DE EMPLEADOS
  // ───────────────────────────────────────────────

  const roleCocinero = await prisma.employeeRole.upsert({
    where: {
      organizationId_name: {
        organizationId: orgA.id,
        name: "Cocinero",
      },
    },
    update: {},
    create: {
      organizationId: orgA.id,
      name: "Cocinero",
    },
  });

  const roleAdministrativa = await prisma.employeeRole.upsert({
    where: {
      organizationId_name: {
        organizationId: orgA.id,
        name: "Administrativa",
      },
    },
    update: {},
    create: {
      organizationId: orgA.id,
      name: "Administrativa",
    },
  });

  const roleDelivery = await prisma.employeeRole.upsert({
    where: {
      organizationId_name: {
        organizationId: orgA.id,
        name: "Delivery",
      },
    },
    update: {},
    create: {
      organizationId: orgA.id,
      name: "Delivery",
    },
  });

  // ───────────────────────────────────────────────
  // EMPLEADOS
  // ───────────────────────────────────────────────

  const empleadosA = await Promise.all([
    prisma.employee.create({
      data: {
        organizationId: orgA.id,
        name: "Carlos Fernández",
        employeeRoleId: roleCocinero.id,
        phone: "3464555555",
        baseSalary: new Prisma.Decimal(650000),
        active: true,
      },
    }),

    prisma.employee.create({
      data: {
        organizationId: orgA.id,
        name: "María López",
        employeeRoleId: roleAdministrativa.id,
        phone: "3464666666",
        baseSalary: new Prisma.Decimal(550000),
        active: true,
      },
    }),

    prisma.employee.create({
      data: {
        organizationId: orgA.id,
        name: "Pedro Gómez",
        employeeRoleId: roleDelivery.id,
        phone: "3464777777",
        baseSalary: new Prisma.Decimal(450000),
        active: true,
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // EMPLEADOS CON ACCESO AL PANEL (ADMIN / STAFF / segundo OWNER)
  // Reflejan el flujo real de invitación (acceptInvitation.ts): todo
  // usuario invitado -sin importar su Role de acceso- queda ligado a un
  // Employee vía userId. Solo el owner fundador (ownerA) queda afuera,
  // porque a él lo crea registerOrganization, no una invitación.
  // ───────────────────────────────────────────────

  await prisma.employee.upsert({
    where: { userId: adminA.id },
    update: {},
    create: {
      organizationId: orgA.id,
      name: adminA.name,
      employeeRoleId: roleAdministrativa.id,
      phone: "3464222222",
      baseSalary: new Prisma.Decimal(600000),
      active: true,
      userId: adminA.id,
    },
  });

  await prisma.employee.upsert({
    where: { userId: staffA.id },
    update: {},
    create: {
      organizationId: orgA.id,
      name: staffA.name,
      employeeRoleId: roleDelivery.id,
      phone: "3464333333",
      baseSalary: new Prisma.Decimal(480000),
      active: true,
      userId: staffA.id,
    },
  });

  await prisma.employee.upsert({
    where: { userId: owner2A.id },
    update: {},
    create: {
      organizationId: orgA.id,
      name: owner2A.name,
      employeeRoleId: roleAdministrativa.id,
      phone: "3464444444",
      baseSalary: new Prisma.Decimal(700000),
      active: true,
      userId: owner2A.id,
    },
  });

  // ───────────────────────────────────────────────
  // PROVEEDORES
  // ───────────────────────────────────────────────

  const proveedoresA = await Promise.all([
    prisma.supplier.upsert({
      where: {
        organizationId_name: {
          organizationId: orgA.id,
          name: "Distribuidora La Harina",
        },
      },
      update: {},
      create: {
        organizationId: orgA.id,
        name: "Distribuidora La Harina",
        contactName: "Jorge Martínez",
        phone: "3464888888",
        email: "ventas@laharina.com",
        active: true,
      },
    }),

    prisma.supplier.upsert({
      where: {
        organizationId_name: {
          organizationId: orgA.id,
          name: "Envases del Centro",
        },
      },
      update: {},
      create: {
        organizationId: orgA.id,
        name: "Envases del Centro",
        contactName: "Laura Sánchez",
        phone: "3464999999",
        email: "ventas@envasescentro.com",
        active: true,
      },
    }),

    prisma.supplier.upsert({
      where: {
        organizationId_name: {
          organizationId: orgA.id,
          name: "Lácteos Casilda",
        },
      },
      update: {},
      create: {
        organizationId: orgA.id,
        name: "Lácteos Casilda",
        contactName: "Roberto Díaz",
        phone: "3464000001",
        email: "contacto@lacteoscasilda.com",
        active: true,
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // GASTOS DE PROVEEDORES
  // ───────────────────────────────────────────────

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "SUPPLIER",
      amount: new Prisma.Decimal(45000),
      date: new Date("2026-08-05"),
      category: "Insumos",
      paymentMethod: "TRANSFER",
      description: "Compra de harina 0000 y harina integral",
      supplierId: proveedoresA[0].id,
      isRecurring: false,
    },
  });

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "SUPPLIER",
      amount: new Prisma.Decimal(28000),
      date: new Date("2026-08-08"),
      category: "Envases",
      paymentMethod: "CASH",
      description: "Compra de cajas y bolsas",
      supplierId: proveedoresA[1].id,
      isRecurring: false,
    },
  });

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "SUPPLIER",
      amount: new Prisma.Decimal(35000),
      date: new Date("2026-08-10"),
      category: "Lácteos",
      paymentMethod: "TRANSFER",
      description: "Compra de manteca y leche",
      supplierId: proveedoresA[2].id,
      isRecurring: false,
    },
  });

  // ───────────────────────────────────────────────
  // GASTOS DE EMPLEADOS
  // ───────────────────────────────────────────────

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "EMPLOYEE",
      amount: new Prisma.Decimal(650000),
      date: new Date("2026-08-01"),
      category: "Sueldo",
      paymentMethod: "TRANSFER",
      description: "Sueldo mensual - Carlos Fernández",
      isRecurring: true,
      employeeId: empleadosA[0].id,
    },
  });

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "EMPLOYEE",
      amount: new Prisma.Decimal(550000),
      date: new Date("2026-08-01"),
      category: "Sueldo",
      paymentMethod: "TRANSFER",
      description: "Sueldo mensual - María López",
      isRecurring: true,
      employeeId: empleadosA[1].id,
    },
  });

  // ───────────────────────────────────────────────
  // GASTOS FIJOS
  // ───────────────────────────────────────────────

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "FIXED",
      amount: new Prisma.Decimal(320000),
      date: new Date("2026-08-03"),
      category: "Alquiler",
      paymentMethod: "TRANSFER",
      description: "Alquiler del local",
      isRecurring: true,
    },
  });

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "FIXED",
      amount: new Prisma.Decimal(85000),
      date: new Date("2026-08-06"),
      category: "Luz",
      paymentMethod: "TRANSFER",
      description: "Factura de electricidad",
      isRecurring: true,
    },
  });

  // ───────────────────────────────────────────────
  // OTROS GASTOS
  // ───────────────────────────────────────────────

  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "OTHER",
      amount: new Prisma.Decimal(18000),
      date: new Date("2026-08-12"),
      category: "Mantenimiento",
      paymentMethod: "CASH",
      description: "Reparación de horno",
      isRecurring: false,
    },
  });

  // ───────────────────────────────────────────────
  // FIN
  // ───────────────────────────────────────────────

  console.log("✅ Seed completada\n");

  console.log("── Credenciales de test (password para todos: 123456) ──");

  console.log(`Org A "sabores" → OWNER: owner@sabores.com`);

  console.log(`Org A "sabores" → ADMIN: admin@sabores.com`);

  console.log(`Org A "sabores" → STAFF: staff@sabores.com`);

  console.log(
    `Org A "sabores" → OWNER (segundo, invitado, con Employee): owner2@sabores.com`,
  );

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
