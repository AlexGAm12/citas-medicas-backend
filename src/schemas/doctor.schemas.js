import { z } from "zod";

export const doctorSchema = z.object({
  user: z
    .string({
      required_error: "El id de usuario es requerido"
    })
    .min(1, "El id de usuario es requerido"),
  specialty: z
    .string({
      required_error: "El id de la especialidad es requerido"
    })
    .min(1, "El id de la especialidad es requerido"),
  phone: z
    .string()
    .optional(),
  bio: z
    .string()
    .optional(),
  consultRoom: z
    .string()
    .optional()
});
