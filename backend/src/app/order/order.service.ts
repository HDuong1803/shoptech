import { IOrders, InputOrderItem } from "@app"
import { Constant } from "@constants"

import { OrderDB, ProductDB } from "@schemas"

class OrderService {
    public async addOrderItems(body?: InputOrderItem, user_id?: string, product_id?: string): Promise<any> {
        const item = await ProductDB.findById(product_id)
        const quantity = body?.orderItems?.[0]?.quantity ?? 0
        const itemsPrice = (item?.price ?? 0) * quantity
        const order = new OrderDB(
            {
                user_id: user_id,
                orderItems: [
                    {
                        product_id: product_id?.toString(),
                        name: item?.name,
                        quantity: body?.orderItems?.[0]?.quantity,
                        image: item?.image,
                        price: itemsPrice
                    }
                  ],
                shipping_address: body?.shippingAddress,
                payment_method: body?.paymentMethod,
                shipping_price: Constant.SHIPPING_PRICE,
                total_price: itemsPrice + Constant.SHIPPING_PRICE
            }
        )
        const createdOrder = await order.save()
        return createdOrder
    }

    public async getListOrders(page: number, limit: number): Promise<any> {
        const offset = (page - 1) * limit

        const listOrders = await OrderDB.find()
        .skip(offset)
        .limit(limit)
        .exec()

        const totalOrder = await OrderDB.countDocuments()

        return {
            data: listOrders,
            total: totalOrder
        }
    }

    public async getOrderById(_id?: string): Promise<IOrders> {
        const order = await OrderDB.findById(_id)
        if(order) {
            return order.toJSON()
        }
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    public async getOrderOfUser(_id?: string): Promise<IOrders> {
        const order = await OrderDB.findById(_id)
        if(order) {
            return order.toJSON()
        }
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    public async updateOrderToPaid(_id?: string): Promise<any> {
        const order = await OrderDB.findById(_id)
        if(order) {
            order.isPaid = true
            order.paidAt = new Date(Date.now())
            order.paymentResult = {
                status: order.paymentResult?.status,
                update_time: order.paymentResult?.update_time,
                email_address: order.paymentResult?.email_address,
            }
            const updatedOrder = await order.save()

            return updatedOrder.toJSON()
        }
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    public async updateOrderToDelivered(_id?: string): Promise<any> {
        const order = await OrderDB.findById(_id)
        if(order) {
            order.isDelivered = true
            order.deliveredAt = new Date(Date.now())

            const updatedOrder = await order.save()

            return updatedOrder.toJSON()
        }
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
}

export { OrderService }
