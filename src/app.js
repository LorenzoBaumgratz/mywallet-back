import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

const app = express(); //app do servidor
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI)
try {
    await mongoClient.connect()
} catch (err) {
    console.log(err.message)
}
export const db = mongoClient.db()

const usuarioSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3)
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required().min(3)
})

const transacaoSchema = joi.object({
    tipo: joi.string().required(),
    valor: joi.number().precision(2).required()
})

app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body

    const validation = usuarioSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map(i => i.message)
        return res.status(422).send(errors)
    }

    const hash = bcrypt.hashSync(senha, 10)

    const usuario = await db.collection("users").findOne({ email })
    if (usuario) return res.sendStatus(409)

    await db.collection("users").insertOne({ nome, email, senha: hash })
    res.sendStatus(201)
})

app.post("/login", async (req, res) => {
    const { email, senha } = req.body

    const validation = loginSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map(i => i.message)
        return res.status(422).send(errors)
    }

    const usuario = await db.collection("users").findOne({ email })
    if (!usuario) return res.sendStatus(404)

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
    if (!senhaCorreta) return res.sendStatus(401)

    const token = uuid()
    await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id })

    delete usuario.senha

    res.status(200).send({nome:usuario.nome,token})
})

app.post("/transacao", async (req, res) => {
    const { authorization } = req.headers
    const { tipo, valor } = req.body

    const token = authorization?.replace('Bearer', '')
    if (!token) res.sendStatus(401)

    const validation = transacaoSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map(i => i.message)
        return res.status(422).send(errors)
    }

    const sessao = await db.collection("sessoes").findOne({ token })
    if (!sessao) return res.sendStatus(401)

    const usuario = await db.collection("users").findOne({ _id: sessao.idUsuario })
    if (!usuario) return res.sendStatus(401)

    await db.collection("transacoes").insertOne({ tipo, valor: valor * 100, idUsuario: usuario._id }) //salva em centavos
    res.sendStatus(201)
})

app.get("/transacoes", async (req, res) => {
    const { authorization } = req.headers

    const token = authorization?.replace('Bearer', '')
    if (!token) res.sendStatus(401)

    const sessao = await db.collection("sessoes").findOne({ token })
    if (!sessao) return res.sendStatus(401)

    // const usuario=await db.collection("users").findOne({_id: sessao.idUsuario})
    // if(!usuario) return res.sendStatus(401)

    const transacoes = await db.collection("transacoes").find({ idUsuario: sessao.idUsuario }).toArray()
    res.status(200).send(transacoes);

    res.sendStatus(201)
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});