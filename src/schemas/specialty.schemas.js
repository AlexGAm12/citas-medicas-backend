import { z } from "zod";

export const specialtySchema = z.object({
  name: z
    .string({
      required_error: "El nombre de la especialidad es requerido"
    })
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .optional()
});
