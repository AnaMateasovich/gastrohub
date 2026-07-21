import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const EXT_BY_TYPE: Record<string, string> = {
  jpeg: ".jpg",
  png: ".png",
  webp: ".webp",
};

export async function uploadToStorage(
  buffer: Buffer,
  imageType: "jpeg" | "png" | "webp",
  slug: string,
): Promise<string> {
 

  const ext = EXT_BY_TYPE[imageType];
  const filename = `${randomUUID()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", slug);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/${slug}/${filename}`;
}