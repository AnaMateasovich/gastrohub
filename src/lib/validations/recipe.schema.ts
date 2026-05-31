import z from "zod";

export const recipeItemSchema = z.object({
  ingredientId: z.number().min(1, "Seleccioná un ingrediente"),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
});

export const createRecipeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  yield: z.number().min(0.01, "El rendimiento debe ser mayor a 0"),
  yieldUnit: z.string().min(1, "La unidad es obligatoria"),
  items: z.array(recipeItemSchema).min(1, "Agregá al menos un ingrediente"),
});

export type CreateRecipeType = z.infer<typeof createRecipeSchema>;
