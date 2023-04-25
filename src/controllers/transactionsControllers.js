import dayjs from "dayjs";
import { db } from "../database/database.js"

export async function postTransacao(req, res) {
    const { tipo, valor,descricao } = req.body
    const { authorization } = req.headers

    const usuario = await db.collection("users").findOne({ _id: sessao.idUsuario })
    if (!usuario) return res.sendStatus(401)

    await db.collection("transacoes").insertOne({ tipo, valor: valor * 100,descricao,data:dayjs().format("DD/MM") ,idUsuario: usuario._id }) //salva em centavos
    res.sendStatus(201)
}

export async function getTransacoes(req, res) {
    const { authorization } = req.headers

    // const usuario=await db.collection("users").findOne({_id: sessao.idUsuario})
    // if(!usuario) return res.sendStatus(401)

    const transacoes = await db.collection("transacoes").find({ idUsuario: sessao.idUsuario }).toArray()
    res.status(200).send(transacoes);

}