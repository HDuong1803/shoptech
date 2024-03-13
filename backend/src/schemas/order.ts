import mongoose, { Schema } from 'mongoose'

export interface orderAttributes {
  username?: string
  email?: string
  order_items?: [orderItems]
  shipping_address?: shippingAddress
  payment_method?: string
  payment_result?: paymentResult
  shipping_price?: number
  total_price?: number
  is_paid?: boolean
  paid_at?: Date
  is_delivered?: boolean
  delivered_at?: Date
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
  postal_code?: string
  country?: string
}

export interface paymentResult {
  status?: string
  update_time?: Date
  email_address?: string
}

const orderItemsSchema = new Schema<orderItems>({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  name: { type: String, 
    required: true
   },
  quantity: { type: Number, 
    required: true 
  },
  image: { type: String, 
    required: true 
  },
  price: { type: Number, 
    required: true 
  }
})

const paymentResultSchema = new Schema<paymentResult>({
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String }
})

const shippingAddressSchema = new Schema<shippingAddress>({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true }

})

const orderSchema = new Schema<orderAttributes>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    order_items: [orderItemsSchema],
    shipping_address: shippingAddressSchema,
    payment_method: {
      type: String,
      required: true
    },
    payment_result: paymentResultSchema,
    shipping_price: {
      type: Number,
      required: true,
      default: 0.0
    },
    total_price: {
      type: Number,
      required: true,
      default: 0.0
    },
    is_paid: {
      type: Boolean,
      required: true,
      default: false
    },
    paid_at: {
      type: Date
    },
    is_delivered: {
      type: Boolean,
      required: true,
      default: false
    },
    delivered_at: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export const OrderDB = mongoose.model('order', orderSchema, undefined, {
  overwriteModels: true
})
