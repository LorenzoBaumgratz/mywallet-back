import { Router } from "express";
import { getTransacoes, postTransacao } from "../controllers/transactionsControllers.js";

const router = Router()

router.post("/transacao", postTransacao)
router.get("/transacoes", getTransacoes)

export default router;