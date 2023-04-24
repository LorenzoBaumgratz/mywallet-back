import { Router } from "express";
import { authRouter } from "../routes/authRouter.js";
import { operationsRouter } from "../routes/operationsRouter.js";

const router = Router()

router.use(authRouter)
router.use(operationsRouter)

export default router;