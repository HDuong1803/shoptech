import { IOrders, InputOrderItem } from '@app'
import { Constant, authUser } from '@constants'
import { stripe } from '@providers'
import { OrderDB, ProductDB, UserDB } from '@schemas'

class OrderService {
  public async getListOrders(page: number, limit: number): Promise<any> {
    const offset = (page - 1) * limit

    const listOrders = await OrderDB.find().skip(offset).limit(limit).exec()

    const totalOrder = await OrderDB.countDocuments()

    return {
      data: listOrders,
      total: totalOrder
    }
  }

  public async getOrderById(_id?: string): Promise<IOrders> {
    const order = await OrderDB.findById(_id)
    if (order) {
      return order.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async updateOrderToPaid(_id?: string): Promise<any> {
    const order = await OrderDB.findById(_id)
    if (order) {
      order.isPaid = true
      order.paidAt = new Date(Date.now())
      order.paymentResult = {
        status: order.paymentResult?.status,
        update_time: order.paymentResult?.update_time,
        email_address: order.paymentResult?.email_address
      }
      const updatedOrder = await order.save()

      return updatedOrder.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async updateOrderToDelivered(_id?: string): Promise<any> {
    const order = await OrderDB.findById(_id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date(Date.now())

      const updatedOrder = await order.save()

      return updatedOrder.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async addOrderItems(
    body?: InputOrderItem,
    user_id?: string,
    product_id?: string
  ): Promise<any> {
    const item = await ProductDB.findById(product_id)
    const quantity = body?.orderItems?.[0]?.quantity ?? 0
    const itemsPrice = (item?.price ?? 0) * quantity
    const createdOrder = await OrderDB.create({
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
      total_price: itemsPrice + Constant.SHIPPING_PRICE,
      isPaid: false
    })
    return createdOrder
  }

  public async getCheckout(user_id: string, order_id: string): Promise<any> {
    const order = await OrderDB.findById(order_id)

    const user = await UserDB.findById(user_id)

    if (!user || !user.email || !order || !order.orderItems) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const line_items = order.orderItems.map(item => {
        if (!item.name || !item.image || !item.price || !item.quantity) {
            throw new Error("Missing required item information");
        }

        return {
            price_data: {
                currency: 'VND',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: item.price,
            },
            quantity: item.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: user.email,
        success_url: Constant.PUBLIC_URL + '/cart?success=1',
        cancel_url: Constant.PUBLIC_URL + '/cart?canceled=1',
        metadata: { orderId: order_id.toString(), test: 'ok' }
    });

    return session.url;
}

  public async getOrderOfUser(authorization: string): Promise<any> {
    const user = await authUser(authorization);
    const order = await OrderDB.find({user_id: user?._id})
    if (!order) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return order
  }
}

export { OrderService }
