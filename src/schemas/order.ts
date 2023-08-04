import mongoose, { Schema } from "mongoose"

export interface orderAttributes {
  user_id?: mongoose.Schema.Types.ObjectId
  orderItems?: [orderItems]
  shippingAddress?: shippingAddress
  paymentMethod?: string
  paymentResult?: paymentResult
  shippingPrice?: number
  totalPrice?: number
  isPaid?: boolean
  paidAt?: Date
  isDelivered?: boolean
  deliveredAt?: Date
}

export interface orderItems {
  product_id?: mongoose.Schema.Types.ObjectId
  name?: string
  quantity?: number
  image?: string
  price?: number
}

export interface shippingAddress {
  address?: string
  city?: string
}

export interface paymentResult {
  status?: string
  update_time?: string
  email_address?: string
}

const orderItemsSchema = new Schema<orderItems>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }
  }
)

const paymentResultSchema = new Schema<paymentResult>(
  {
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  }
)

const shippingAddressSchema = new Schema<shippingAddress>(
  {
    address: { type: String, required: true },
    city: { type: String, required: true }
  }
)

const orderSchema = new Schema<orderAttributes>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [orderItemsSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: paymentResultSchema,
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const OrderDB = mongoose.model("order", orderSchema, undefined, {
  overwriteModels: true,
});
