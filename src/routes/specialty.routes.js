import { Router } from "express";
import {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
} from "../controllers/specialty.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { specialtySchema } from "../schemas/specialty.schemas.js";
import { authRequired } from "../middlewares/authRequired.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Obtener todas las especialidades (público o solo autenticado, tú decides)
// Si quieres obligar login, agrega authRequired aquí también
router.get("/specialties", getSpecialties);

// Crear especialidad (solo admin)
router.post(
  "/specialties",
  authRequired,
  isAdmin,
  validateSchema(specialtySchema),
  createSpecialty
);

// Actualizar especialidad (solo admin)
router.put(
  "/specialties/:id",
  authRequired,
  isAdmin,
  validateSchema(specialtySchema),
  updateSpecialty
);

// Eliminar especialidad (solo admin)
router.delete(
  "/specialties/:id",
  authRequired,
  isAdmin,
  deleteSpecialty
);

export default router;
