import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctor.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { doctorSchema } from "../schemas/doctor.schemas.js";
import { authRequired } from "../middlewares/authRequired.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Listar doctores (puedes decidir si lo haces público o solo autenticado)
router.get("/doctors", getDoctors);

// Obtener un doctor por id
router.get("/doctors/:id", getDoctorById);

// Crear doctor (solo admin)
router.post(
  "/doctors",
  authRequired,
  isAdmin,
  validateSchema(doctorSchema),
  createDoctor
);

// Actualizar doctor (solo admin)
router.put(
  "/doctors/:id",
  authRequired,
  isAdmin,
  validateSchema(doctorSchema),
  updateDoctor
);

// Eliminar doctor (solo admin)
router.delete(
  "/doctors/:id",
  authRequired,
  isAdmin,
  deleteDoctor
);

export default router;
