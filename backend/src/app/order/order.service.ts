import { InputOrderItem } from '@app'
import { Constant } from '@constants'
import { stripe } from '@providers'
import { CartDB, OrderDB, UserDB } from '@schemas'

class OrderService {
  public async getListOrders(page: number, limit: number): Promise<any> {
    const offset = (page - 1) * limit

    const listOrders = await OrderDB.find().sort({created_at: -1}).skip(offset).limit(limit).exec()

    const totalOrder = await OrderDB.countDocuments()

    return {
      data: listOrders,
      total: totalOrder
    }
  }

  public async getOrder(_id: string): Promise<any> {
    const order = await OrderDB.findById(_id)
    if (order) {
      return order.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async updateOrderToPaid(_id?: string): Promise<any> {
    const order = await OrderDB.findById(_id)
    if (order) {
      order.is_paid = true
      order.paid_at = new Date(Date.now())
      order.payment_result = {
        status: order.payment_result?.status,
        update_time: order.payment_result?.update_time,
        email_address: order.payment_result?.email_address
      }
      const updatedOrder = await order.save()

      return updatedOrder.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async updateOrderToDelivered(_id?: string): Promise<any> {
    const order = await OrderDB.findById(_id)
    if (order) {
      order.is_delivered = true
      order.delivered_at = new Date(Date.now())

      const updatedOrder = await order.save()

      return updatedOrder.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async addOrderItems(
    body?: InputOrderItem,
    user_id?: string,
  ): Promise<any> {
    const user = await UserDB.findById(user_id);
    const dataCart = await CartDB.findOne({user_id: user?._id})
    const orderItems = await dataCart?.cart?.map((item: any) => {
      const orderItems = {
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price
      }
      return orderItems
    })
    const totalPrice = orderItems?.reduce((total: any, item) => total + item.price * item.quantity, 0);

    const createdOrder = await OrderDB.create({
      username: user?.username,
      email: user?.email,
      order_items: orderItems,
      shipping_address: body?.shipping_address,
      payment_method: body?.payment_method,
      shipping_price: Constant.SHIPPING_PRICE,
      total_price: (totalPrice + Constant.SHIPPING_PRICE).toFixed(2),
      is_paid: false
    })
    return createdOrder
  }

  public async getCheckout(user_id: string, order_id: string): Promise<any> {
    const user = await UserDB.findById(user_id);
    const order = await OrderDB.findById(order_id)

    if (!user || !user.email || !order || !order.order_items) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const line_items = order.order_items.map(item => {
        if (!item.name || !item.image || !item.price || !item.quantity) {
            throw new Error("Missing required item information");
        }

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: user.email,
        success_url: 'http://localhost:3000/',
        cancel_url: Constant.PUBLIC_URL + '/cart?canceled=1',
        metadata: { orderId: order_id.toString(), test: 'ok' }
    });
    return session.url;
}

  public async getOrderOfUser(user_id: string): Promise<any> {
    const user = await UserDB.findById(user_id);
    const order = await OrderDB.find({user_id: user?._id.toString()})
    if (!order) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return order
  }
}

export { OrderService }
