import { v4 as uuid } from "uuid"
import bcrypt from "bcrypt"
import { db } from "../database/database.js"

export async function cadastro(req, res) {
    const { nome, email, senha } = req.body

    const hash = bcrypt.hashSync(senha, 10)

    const usuario = await db.collection("users").findOne({ email })
    if (usuario) return res.status(409).send("Usuario já existente")

    await db.collection("users").insertOne({ nome, email, senha: hash })
    res.sendStatus(201)
}

export async function login(req, res){
    const { email, senha } = req.body

    const usuario = await db.collection("users").findOne({ email })
    if (!usuario) return res.status(404).send("email e/ou senha incorretos")

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
    if (!senhaCorreta) return res.status(401).send("email e/ou senha incorretos")

    const token = uuid()
    await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id })

    delete usuario.senha

    res.status(200).send({nome:usuario.nome,token})
}