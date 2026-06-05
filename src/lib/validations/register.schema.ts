import z from "zod";

export const registerSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
  name: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(6),
  address: z.string().min(1),
});