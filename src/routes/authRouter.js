import { Router } from "express";
import { cadastro, login } from "../controllers/authControllers.js";

const router = Router()

router.post("/cadastro", cadastro)
router.post("/login", login)

export default router;