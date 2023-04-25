import { db } from "../database/database"

export async function authValidation(req,res,next){
    const { authorization } = req.headers

    const token = authorization?.replace('Bearer ', '')
    if (!token) res.sendStatus(401)
    
    const sessao = await db.collection("sessoes").findOne({ token })
    if (!sessao) return res.sendStatus(401)

    next()
}