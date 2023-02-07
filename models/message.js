import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
    text: String,
    createdBy: String
})

export const Message = model('messages', messageSchema)
