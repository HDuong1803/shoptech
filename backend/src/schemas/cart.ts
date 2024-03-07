import mongoose, { Schema } from 'mongoose'

export interface cartItems {
  product_id?: mongoose.Schema.Types.ObjectId
  name?: string
  quantity?: number
  image?: string
  price?: number
}

export interface CartAttributes {
  user_id?: string
  cart?: [cartItems]
}

const cartItemsSchema = new Schema<cartItems>({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true }
})

const CartSchema = new Schema<CartAttributes>({
  user_id: { type: String, required: true, ref: 'User' },
  cart: [cartItemsSchema]
})

export const CartDB = mongoose.model('cart', CartSchema, undefined, {
  overwriteModels: true
})
