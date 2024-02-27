export interface IOrders {
    user_id?: string
    orderItems?: orderItems[]
    shippingAddress?: shippingAddress
    paymentMethod?: string
    paymentResult?: string
    shippingPrice?: number
    totalPrice?: number
    isPaid?: boolean
    paidAt?: Date
    isDelivered?: boolean
    deliveredAt?: Date
}

export interface InputOrderItem {
    orderItems?: orderItems[]
    shippingAddress?: shippingAddress
    paymentMethod?: string
    shippingPrice?: number
    totalPrice?: number
}

export interface orderItems {
    product_id?: string;
    name?: string;
    quantity?: number;
    image?: string;
    price?: number;
}

export interface shippingAddress {
    address?: string
    city?: string
}

export type OutputCheckout = string