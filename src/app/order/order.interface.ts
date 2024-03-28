export interface IOrders {
  user_id?: string
  order_items?: any
  shipping_address?: shippingAddress
  payment_method?: string
  payment_result?: string
  shipping_price?: number
  total_price?: number
  is_paid?: boolean
  paid_at?: Date
  is_delivered?: boolean
  delivered_at?: Date
}

export interface InputOrderItem {
  shipping_address?: shippingAddress
  payment_method?: string
}

export interface shippingAddress {
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

export type OutputCheckout = string
