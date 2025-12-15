import { z } from "zod";

export const availabilityCreateSchema = z.object({
  doctor: z.string().min(1, "doctor requerido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotDuration: z
    .union([z.number(), z.string()])
    .transform((v) => (typeof v === "string" ? parseInt(v, 10) : v))
    .refine((v) => Number.isFinite(v) && v >= 5, "slotDuration mínimo 5"),
  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined) return true;
      if (typeof v === "boolean") return v;
      return v === "true";
    }),
});

export const availabilityUpdateSchema = availabilityCreateSchema.partial();
