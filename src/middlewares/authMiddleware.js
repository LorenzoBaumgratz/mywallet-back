import { db } from "../database/database.js"

export async function authValidation(req,res,next){
    const { authorization } = req.headers

    const token = authorization?.replace('Bearer ', '')
    if (!token) res.sendStatus(401)
    
    try{
        const sessao = await db.collection("sessoes").findOne({ token })
        if (!sessao) return res.sendStatus(401)
    
        res.locals.sessao=sessao
    }catch(err){
        return res.status(500).send(err.message)
    }
    
    next()
}