export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function detectImageType(
  buffer: Buffer,
): "jpeg" | "png" | "webp" | null {
  const signatures: Record<string, number[]> = {
    jpeg: [0xff, 0xd8, 0xff],
    png: [0x89, 0x50, 0x4e, 0x47],
    webp: [0x52, 0x49, 0x46, 0x46], 
  };

  for (const [type, signature] of Object.entries(signatures)) {
    if (signature.every((byte, i) => buffer[i] === byte)) {
      if (type === "webp") {
        const webpMarker = buffer.subarray(8, 12).toString("ascii");
        if (webpMarker !== "WEBP") continue;
      }
      return type as "jpeg" | "png" | "webp";
    }
  }

  return null;
}
