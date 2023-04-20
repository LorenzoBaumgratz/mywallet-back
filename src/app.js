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

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});