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
    where: {
      userId_organizationId: { userId: ownerA.id, organizationId: orgA.id },
    },
    update: {},
    create: { userId: ownerA.id, organizationId: orgA.id, role: Role.OWNER },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: { userId: adminA.id, organizationId: orgA.id },
    },
    update: {},
    create: { userId: adminA.id, organizationId: orgA.id, role: Role.ADMIN },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: { userId: staffA.id, organizationId: orgA.id },
    },
    update: {},
    create: { userId: staffA.id, organizationId: orgA.id, role: Role.STAFF },
  });

  await prisma.storeSettings.upsert({
    where: { organizationId: orgA.id },
    update: {},
    create: {
      organizationId: orgA.id,
      organizationName: "Sabores Naturales",

      deliveryFee: new Prisma.Decimal(1000),
      freeDeliveryFrom: new Prisma.Decimal(20000),
      minimumOrderAmount: new Prisma.Decimal(0),

      storeOpen: true,
      openingTime: "08:00",
      closingTime: "20:00",

      whatsappPhone: "3464555111",
      storeEmail: "hola@sabores.com",
      instagramUrl: "https://instagram.com/saboresnaturales.casilda",

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

  // Ingrediente + receta + producto (para testear el costeo)
  const harina = await prisma.ingredient.create({
    data: {
      organizationId: orgA.id,
      name: "Harina 000",
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
          create: [
            {
              productId: productos[i % productos.length].id,
              quantity: 1,
              price: 3500,
            },
          ],
        },
      },
    });
  }

  await prisma.coupon.upsert({
    where: {
      organizationId_code: { organizationId: orgA.id, code: "BIENVENIDA10" },
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
    where: {
      userId_organizationId: { userId: ownerB.id, organizationId: orgB.id },
    },
    update: {},
    create: { userId: ownerB.id, organizationId: orgB.id, role: Role.OWNER },
  });

  await prisma.storeSettings.upsert({
    where: { organizationId: orgB.id },
    update: {},
    create: {
      organizationId: orgB.id,
      organizationName: "Otra Pastelería",

      deliveryFee: new Prisma.Decimal(500),
      freeDeliveryFrom: new Prisma.Decimal(15000),
      minimumOrderAmount: new Prisma.Decimal(0),

      storeOpen: true,
      openingTime: "09:00",
      closingTime: "19:00",

      whatsappPhone: "3464333333",
      storeEmail: "contacto@otrapasteleria.com",
      instagramUrl: "https://instagram.com/otrapasteleria",

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
      orderItems: {
        create: [{ productId: productoB.id, quantity: 1, price: 4000 }],
      },
    },
  });
  const roleCocinero = await prisma.employeeRole.create({
    data: {
      organizationId: orgA.id,
      name: "Cocinero",
    },
  });

  const roleAdministrativa = await prisma.employeeRole.create({
    data: {
      organizationId: orgA.id,
      name: "Administrativa",
    },
  });

  const roleDelivery = await prisma.employeeRole.create({
    data: {
      organizationId: orgA.id,
      name: "Delivery",
    },
  });

  const empleadosA = await Promise.all([
    prisma.employee.create({
      data: {
        organizationId: orgA.id,
        name: "Carlos Fernández",
        roleId: roleCocinero.id,
        phone: "3464555555",
        baseSalary: new Prisma.Decimal(650000),
        active: true,
      },
    }),

    prisma.employee.create({
      data: {
        organizationId: orgA.id,
        name: "María López",
        roleId: roleAdministrativa.id,
        phone: "3464666666",
        baseSalary: new Prisma.Decimal(550000),
        active: true,
      },
    }),

    prisma.employee.create({
      data: {
        organizationId: orgA.id,
        name: "Pedro Gómez",
        roleId: roleDelivery.id,
        phone: "3464777777",
        baseSalary: new Prisma.Decimal(450000),
        active: true,
      },
    }),
  ]);

  const proveedoresA = await Promise.all([
    prisma.supplier.create({
      data: {
        organizationId: orgA.id,
        name: "Distribuidora La Harina",
        contactName: "Jorge Martínez",
        phone: "3464888888",
        email: "ventas@laharina.com",
        active: true,
      },
    }),
    prisma.supplier.create({
      data: {
        organizationId: orgA.id,
        name: "Envases del Centro",
        contactName: "Laura Sánchez",
        phone: "3464999999",
        email: "ventas@envasescentro.com",
        active: true,
      },
    }),
    prisma.supplier.create({
      data: {
        organizationId: orgA.id,
        name: "Lácteos Casilda",
        contactName: "Roberto Díaz",
        phone: "3464000001",
        email: "contacto@lacteoscasilda.com",
        active: true,
      },
    }),
  ]);

  // Gastos de proveedores
  await prisma.expense.create({
    data: {
      organizationId: orgA.id,
      type: "SUPPLIER",
      amount: new Prisma.Decimal(45000),
      date: new Date("2026-08-05"),
      category: "Insumos",
      paymentMethod: "TRANSFER",
      description: "Compra de harina 0000 y harina integral",
      isRecurring: false,
      supplierId: proveedoresA[0].id,
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
      isRecurring: false,
      supplierId: proveedoresA[1].id,
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
      isRecurring: false,
      supplierId: proveedoresA[2].id,
    },
  });

  // Gastos de empleados
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

  // Gastos fijos
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

  // Otros gastos
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
