export function slugify(text: string): string {
  return text
    .normalize("NFD")                   // separa letra + acento (á → a + ´)
    .replace(/[\u0300-\u036f]/g, "")     // elimina los acentos sueltos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")        // saca caracteres especiales
    .replace(/[\s_-]+/g, "-")            // espacios/guiones bajos → un solo guion
    .replace(/^-+|-+$/g, "");            // saca guiones al principio/final
}