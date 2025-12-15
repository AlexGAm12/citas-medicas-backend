import { Router } from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getReports } from "../controllers/reports.controller.js";

const router = Router();

router.get("/reports", authRequired, isAdmin, getReports);

export default router;
