import joi from "joi";

export const transacaoSchema = Joi.object({
    tipo: joi.string().required(),
    valor: joi.number().precision(2).required(),
    descricao:joi.string().required()
})