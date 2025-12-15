import { Router } from "express";
import { authRequired } from "../middlewares/authRequired.js";

import { isDoctorOrAdmin } from "../middlewares/isDoctorOrAdmin.js";

import {
  getMyAvailability,
  getAvailabilityByDoctor,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availability.controller.js";

const router = Router();

router.get("/my", authRequired, isDoctorOrAdmin, getMyAvailability);
router.get("/doctor/:doctorId", authRequired, getAvailabilityByDoctor);

router.post("/", authRequired, isDoctorOrAdmin, createAvailability);
router.put("/:id", authRequired, isDoctorOrAdmin, updateAvailability);
router.delete("/:id", authRequired, isDoctorOrAdmin, deleteAvailability);

export default router;
