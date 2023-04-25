import { Router } from "express";
import { getTransacoes, postTransacao } from "../controllers/transactionsControllers.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { transacaoSchema } from "../schemas/transacaoSchema.js";
import { authValidation } from "../middlewares/authMiddleware.js";

const router = Router()

router.use(authValidation)
router.post("/transacao", validateSchema(transacaoSchema),postTransacao)
router.get("/transacoes", getTransacoes)

export default router;