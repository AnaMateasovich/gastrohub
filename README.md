# Sabores Naturales 🥖🌿

Aplicación web fullstack desarrollada para un emprendimiento real de panadería saludable y productos artesanales. Incluye panel de administración completo, sistema de pedidos, gestión de recetas con cálculo de costos y rentabilidad, y flujo de compra para clientes.

---

## ✨ Features

**Panel de administración**
- CRUD de productos con imágenes, slugs y variantes de venta
- Sistema de recetas con ingredientes, rendimiento y cálculo de costo automático
- Cálculo de ganancia por producto (costo manual o por receta)
- Gestión de pedidos con cambio de estado y notificaciones por WhatsApp
- Dashboard con estadísticas de ventas

**Tienda**
- Catálogo visual de productos con páginas individuales
- Carrito de compras persistente
- Checkout con opción de envío o retiro
- Registro y login de usuarios con JWT
- Email de bienvenida automático (Resend)

---

## 🛠️ Tecnologías

- **Next.js 15** — App Router, Server Actions, `use cache`
- **TypeScript**
- **Prisma** + **MySQL**
- **Tailwind CSS**
- **React Hook Form** + **Zod**
- **Resend** — emails transaccionales
- **bcryptjs** + **JWT** — autenticación

---

## 🚀 Instalación

```bash
git clone https://github.com/AnaMateasovich/sabores-naturales-app
cd sabores-naturales-app
npm install
```

Configurá las variables de entorno:

```bash
cp .env.example .env
```

```env
DATABASE_URL="mysql://..."
JWT_SECRET="tu_secreto"
RESEND_API_KEY="tu_api_key"
```

Inicializá la base de datos y cargá los datos de prueba:

```bash
npx prisma migrate dev
npx prisma db seed
```

El seed crea:
- Usuario **admin** → `admin@admin.com` / `admin123`
- Usuario **cliente** → `cliente@cliente.com` / `cliente123`
- Ingredientes, recetas y productos de ejemplo con imágenes

Levantá el servidor:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

Panel de administración: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📂 Estructura
\`\`\`
src/
├── app/
│   ├── (main)/          # Tienda pública
│   ├── (admin)/         # Panel de administración
│   ├── api/             # Route handlers
│   └── types/           # Tipos TypeScript
├── lib/
│   ├── actions/         # Server Actions
│   ├── validations/     # Schemas Zod
│   └── prisma.ts
├── contexts/            # Cart, User
└── utils/
public/
└── products/            # Imágenes de productos
prisma/
├── schema.prisma
└── seed.ts
\`\`\`

---

## 👩‍💻 Autora

**Ana Mateasovich** — Frontend / Fullstack Developer

[![GitHub](https://img.shields.io/badge/GitHub-AnaMateasovich-181717?logo=github)](https://github.com/AnaMateasovich)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ana_Mateasovich-0A66C2?logo=linkedin)](https://www.linkedin.com/in/ana-mateasovich/)
