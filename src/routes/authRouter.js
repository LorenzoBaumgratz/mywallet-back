import { Router } from "express";
import { cadastro, login } from "../controllers/authControllers.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { usuarioSchema } from "../schemas/usuarioSchema.js";
import { loginSchema } from "../schemas/loginSchema.js";

const router = Router()

router.post("/cadastro", validateSchema(usuarioSchema),cadastro)
router.post("/login",validateSchema(loginSchema), login)

export default router;