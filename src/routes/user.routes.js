import { Router } from "express";
import { register, login, logout, profile } from "../controllers/auth.controller.js";
import { getUsers } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.get("/users", authRequired, getUsers);

export default router;
