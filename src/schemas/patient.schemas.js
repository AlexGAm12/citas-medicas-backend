import { z } from "zod";

export const patientSchema = z.object({
  user: z
    .string({
      required_error: "El id de usuario es requerido"
    })
    .min(1, "El id de usuario es requerido"),
  phone: z
    .string()
    .optional(),
  dateOfBirth: z
    .string()
    .optional(), // la recibimos como string (YYYY-MM-DD)
  gender: z
    .enum(["masculino", "femenino", "otro"])
    .optional(),
  allergies: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional()
});
