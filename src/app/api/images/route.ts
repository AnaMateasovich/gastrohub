import { requireRole } from "@/src/lib/auth/role";
import { getCurrentTenant } from "@/src/lib/tenant/tenant";
import {
  ALLOWED_MIME_TYPES,
  detectImageType,
  MAX_FILE_SIZE,
} from "@/src/utils/images.utils";
import { uploadToStorage } from "@/src/utils/upload.utils";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function handleImageUpload(req: NextRequest) {
  try {
    await requireRole([Role.OWNER, Role.ADMIN, Role.STAFF]);

    const tenant = await getCurrentTenant();

    let formData: FormData;
    formData = await req.formData();

    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No se envió archivo" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo permitido (5MB)" },
        { status: 413 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Archivo vacío" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const realType = detectImageType(buffer);

    if (!realType) {
      return NextResponse.json(
        { error: "El archivo no es una imagen válida" },
        { status: 400 },
      );
    }

    const url = await uploadToStorage(buffer, realType, tenant.slug);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 },
    );
  }
}

// POST → subir imagen para un producto nuevo (aún no existe)
export async function POST(req: NextRequest) {
  return handleImageUpload(req);
}

// PATCH → reemplazar/agregar imagen a un producto existente
export async function PATCH(req: NextRequest) {
  return handleImageUpload(req);
}
