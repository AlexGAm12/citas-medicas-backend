import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getMyPatientProfile, 
} from "../controllers/patient.controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";
import { patientSchema } from "../schemas/patient.schemas.js";
import { authRequired } from "../middlewares/authRequired.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/patients/me", authRequired, getMyPatientProfile);

router.get("/patients", authRequired, isAdmin, getPatients);

router.get("/patients/:id", authRequired, isAdmin, getPatientById);

router.post("/patients", authRequired, isAdmin, validateSchema(patientSchema), createPatient);

router.put("/patients/:id", authRequired, isAdmin, validateSchema(patientSchema), updatePatient);

router.delete("/patients/:id", authRequired, isAdmin, deletePatient);

export default router;
