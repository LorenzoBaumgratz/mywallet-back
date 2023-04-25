import dayjs from "dayjs";
import { db } from "../database/database.js"

export async function postTransacao(req, res) {
    const { tipo, valor, descricao } = req.body

    const sessao = res.locals.sessao
    try {
        const usuario = await db.collection("users").findOne({ _id: sessao.idUsuario })
        if (!usuario) return res.sendStatus(401)

        await db.collection("transacoes").insertOne({ tipo, valor: valor * 100, descricao, data: dayjs().format("DD/MM"), idUsuario: usuario._id }) //salva em centavos
        res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message)
    }


}

export async function getTransacoes(req, res) {

    // const usuario=await db.collection("users").findOne({_id: sessao.idUsuario})
    // if(!usuario) return res.sendStatus(401)

    const sessao = res.locals.sessao

    try {
        const transacoes = await db.collection("transacoes").find({ idUsuario: sessao.idUsuario }).toArray()
        res.status(200).send(transacoes);
    } catch (err) {
        return res.status(500).send(err.message)
    }


}