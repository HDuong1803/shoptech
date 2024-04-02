import { type InputOrderItem } from '@app'
import { Constant } from '@constants'
import { stripe } from '@providers'
import { CartDB, OrderDB, UserDB } from '@schemas'

class OrderService {
  /**
   * Retrieves a list of orders with pagination.
   * @param {number} page - The page number.
   * @param {number} limit - The maximum number of orders per page.
   * @returns {Promise<any>} - A promise that resolves to an object containing the list of orders and total count.
   */
  public async getListOrders(page: number, limit: number): Promise<any> {
    const offset = (page - 1) * limit

    const listOrders = await OrderDB.find()
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .exec()

    const totalOrder = await OrderDB.countDocuments()

    return {
      data: listOrders,
      total: totalOrder
    }
  }

  /**
   * Retrieves a specific order by its ID.
   * @param {string} _id - The ID of the order to retrieve.
   * @returns {Promise<any>} - A promise that resolves to the order object if found.
   * If the order is not found, an error is thrown.
   */
  public async getOrder(_id: string): Promise<any> {
    const order = await OrderDB.findById(_id)
    if (order) {
      return order.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Updates an order to mark it as paid.
   * @param {string} _id - The ID of the order to be updated.
   * @returns {Promise<any>} - A promise that resolves to the updated order object.
   */
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

  /**
   * Updates an order to mark it as delivered.
   * @param {string} _id - The ID of the order to be updated.
   * @returns {Promise<any>} - A promise that resolves to the updated order object.
   */
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

  /**
   * Adds order items to create a new order.
   * @param {InputOrderItem} body - The order item details.
   * @param {string} user_id - The ID of the user placing the order.
   * @returns {Promise<any>} - A promise that resolves to the created order object.
   */
  public async addOrderItems(
    body?: InputOrderItem,
    user_id?: string
  ): Promise<any> {
    const user = await UserDB.findById(user_id)
    const dataCart = await CartDB.findOne({ user_id: user?._id })
    const orderItems = dataCart?.cart?.map((item: any) => {
      const orderItems = {
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price
      }
      return orderItems
    })
    const totalPrice = orderItems?.reduce(
      (total: number, item) => total + item.price * item.quantity,
      0
    )

    const createdOrder = await OrderDB.create({
      user_id,
      username: user?.username,
      email: user?.email,
      order_items: orderItems,
      shipping_address: body?.shipping_address,
      payment_method: body?.payment_method,
      shipping_price: Constant.SHIPPING_PRICE,
      total_price: (Number(totalPrice) + Constant.SHIPPING_PRICE).toFixed(2),
      is_paid: false
    })
    return createdOrder
  }

  /**
   * Retrieves a checkout session URL for payment processing.
   * @param {string} user_id - The ID of the user making the order.
   * @param {string} order_id - The ID of the order for checkout.
   * @returns {Promise<any>} - A promise that resolves to the checkout session URL.
   */
  public async getCheckout(user_id: string, order_id: string): Promise<any> {
    const user = await UserDB.findById(user_id)
    const order = await OrderDB.findById(order_id)

    if (!user?.email || !order?.order_items) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const line_items = order.order_items.map(item => {
      if (!item.name || !item.image || !item.price || !item.quantity) {
        throw new Error('Missing required item information')
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image]
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      }
    })

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: user.email,
      success_url: Constant.PUBLIC_URL + `/order/${order_id}`,
      cancel_url: Constant.PUBLIC_URL + '/cart?canceled=1',
      metadata: { orderId: order_id.toString(), test: 'ok' }
    })
    return session.url
  }

  /**
   * Retrieves orders placed by a specific user.
   * @param {string} user_id - The ID of the user.
   * @returns {Promise<any>} - A promise that resolves to the list of orders for the user.
   */
  public async getOrderOfUser(user_id: string): Promise<any> {
    const user = await UserDB.findById(user_id)
    const order = await OrderDB.find({ user_id: user?._id.toString() })
    if (!order) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return order
  }
}

export { OrderService }
