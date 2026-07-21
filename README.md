# GastroHub 🥖🌿

SaaS multi-tenant para la gestión integral de emprendimientos gastronómicos (panaderías, pastelerías, etc.). Nacido a partir de Sabores Naturales, un proyecto real para un emprendimiento de panadería, evolucionado en una plataforma que permite alojar múltiples organizaciones independientes bajo una misma aplicación, cada una con su equipo, roles y catálogo propio.

---

## ✨ Features

**Multi-tenancy & equipos**
- Organizaciones aisladas por `organizationId` (cada negocio ve solo sus propios datos)
- Sistema de roles por organización: **OWNER**, **ADMIN**, **STAFF**
- Gestión de miembros del equipo, independiente de los clientes de la tienda

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
- Registro y login de clientes con JWT
- Email de bienvenida automático (Resend)

<!-- TODO: agregar acá "Suscripción y billing" cuando esté implementado -->

---

## 🛠️ Tecnologías

- **Next.js 15** — App Router, Server Actions, `use cache`
- **TypeScript**
- **Prisma** + **MySQL**
- **Tailwind CSS**
- **React Hook Form** + **Zod**
- **Resend** — emails transaccionales
- **bcryptjs** + **JWT** — autenticación
- **Pytest** + **Playwright** — tests E2E

---

## 🚀 Instalación

```bash
git clone https://github.com/AnaMateasovich/gastrohub
cd gastrohub
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

El seed crea **dos organizaciones separadas**, pensadas para probar el aislamiento multi-tenant:

| Organización | Rol | Email | Password |
|---|---|---|---|
| `sabores` | OWNER | `owner@sabores.com` | `123456` |
| `sabores` | ADMIN | `admin@sabores.com` | `123456` |
| `sabores` | STAFF | `staff@sabores.com` | `123456` |
| `otra-pasteleria` | OWNER | `owner@otrapasteleria.com` | `123456` |

Además de organizaciones, memberships, ingredientes, recetas, productos, clientes, pedidos (en distintos estados) y un cupón de ejemplo para la organización principal.

Levantá el servidor:

```bash
npm run dev
```

> **Nota:** la app usa subdominios para identificar cada organización (multi-tenancy). Accedé vía:
> - Tienda: `http://sabores.lvh.me:3000`
> - Panel de administración: `http://sabores.lvh.me:3000/admin`
>
> `lvh.me` resuelve automáticamente a `127.0.0.1`, así que no requiere configuración extra en `/etc/hosts`. Para probar la organización B, usá `http://otra-pasteleria.lvh.me:3000`.

---

## 🧪 Testing

El proyecto incluye tests End-to-End (E2E) escritos en Python con Pytest + Playwright, que simulan el flujo real de un usuario en el navegador (login, gestión de productos, pedidos, aislamiento entre organizaciones, etc.).

### Instalación

```bash
cd tests
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### Ejecución

Con la app corriendo (`npm run dev`):

```bash
cd tests
pytest -v
```

Los tests usan las mismas credenciales que genera el seed de Prisma (ver tabla más arriba), así que no requieren configuración adicional — el archivo `tests/.env` ya viene con esos valores de demo.

### Qué cubren

<!-- TODO: actualizar a medida que escribas los tests reales -->
- Login y autenticación por organización
- CRUD de productos (admin)
- Flujo de compra (tienda pública)
- Gestión de pedidos
- Aislamiento multi-tenant (una organización no puede ver/modificar datos de otra)

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
tests/
└── e2e/                 # Tests End-to-End (Pytest + Playwright)
\`\`\`

---

## 👩‍💻 Autora

**Ana Mateasovich** — Frontend / Fullstack Developer

[![GitHub](https://img.shields.io/badge/GitHub-AnaMateasovich-181717?logo=github)](https://github.com/AnaMateasovich)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ana_Mateasovich-0A66C2?logo=linkedin)](https://www.linkedin.com/in/ana-mateasovich/)