import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "El username es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña mínima de 6 caracteres"),
  role: z.enum(["admin", "doctor", "paciente"], {
    errorMap: () => ({ message: "Rol inválido" })
  })
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña inválida")
});
