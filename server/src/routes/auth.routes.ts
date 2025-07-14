import { Router } from "express";

import { registerSchema, loginSchema } from "../validation/auth.validation";
import { validate } from "../middleware/validate.middleware";

import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/refresh", refreshToken);
router.get("/logout", logout);

export default router;
