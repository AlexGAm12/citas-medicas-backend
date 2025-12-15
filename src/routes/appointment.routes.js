import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";

import { authRequired } from "../middlewares/authRequired.js";


import {
  appointmentCreateSchema,
  appointmentStatusSchema,
} from "../schemas/appointment.schemas.js";

import {
  getAllAppointments,
  getMyAppointments,
  getAvailableSlots,
  createAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

const router = Router();

router.get("/available-slots", authRequired, getAvailableSlots);

router.post("/", authRequired, validateSchema(appointmentCreateSchema), createAppointment);

router.get("/my", authRequired, getMyAppointments);

router.get("/", authRequired, getAllAppointments);

router.patch(
  "/:id/status",
  authRequired,
  validateSchema(appointmentStatusSchema),
  updateAppointmentStatus
);

export default router;
