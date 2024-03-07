import mongoose, { Schema } from 'mongoose'

export interface TokenAttributes {
  token?: string
  create_at?: Date
  user_id?: mongoose.Schema.Types.ObjectId
}

const tokenSchema = new Schema<TokenAttributes>({
  token: {
    type: String,
    unique: true
  },
  create_at: Date,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

export const TokenDB = mongoose.model('token', tokenSchema, undefined, {
  overwriteModels: true
})
