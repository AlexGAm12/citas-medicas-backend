import { z } from "zod";

const hhmm = /^\d{2}:\d{2}$/;
const ymd = /^\d{4}-\d{2}-\d{2}$/;

export const appointmentCreateSchema = z.object({
  doctor: z.string().min(1, "El id del doctor es requerido"),
  patient: z.string().min(1, "El id del paciente es requerido"),

  specialty: z.string().optional(),

  date: z.string().regex(ymd, "Formato de fecha inválido, use YYYY-MM-DD"),

  startTime: z.string().regex(hhmm, "Formato de hora inválido, use HH:MM"),
  endTime: z.string().regex(hhmm, "Formato de hora inválido, use HH:MM"),

  reason: z.string().optional(),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(["pendiente", "confirmada", "cancelada", "finalizada"]),
});
