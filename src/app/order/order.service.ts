import { type InputOrderItem } from '@app'
import { Constant } from '@constants'
import { stripe } from '@providers'
import { db } from '@utils'

class OrderService {
  /**
   * Retrieves a list of orders with pagination.
   * @param {number} page - The page number.
   * @param {number} limit - The maximum number of orders per page.
   * @returns {Promise<any>} - A promise that resolves to an object containing the list of orders and total count.
   */
  public async getListOrders(page: number, limit: number): Promise<any> {
    const offset = (page - 1) * limit

    const listOrders = await db.order.findMany({
      orderBy: { id: 'desc' },
      skip: offset,
      take: limit,
      include: {
        items: true,
        shipping_address: true,
        payment_result: true
      }
    })

    const totalOrder = await db.order.count()

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
    const order = await db.order.findFirst({ where: { id: _id } })
    if (order) {
      return order
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Updates an order to mark it as paid.
   * @param {string} _id - The ID of the order to be updated.
   * @returns {Promise<any>} - A promise that resolves to the updated order object.
   */
  public async updateOrderToPaid(_id?: string): Promise<any> {
    const order = await db.order.findFirst({
      where: { id: _id },
      include: {
        payment_result: true
      }
    })
    if (order) {
      await db.order.update({
        where: {
          id: _id
        },
        data: {
          is_paid: true,
          paid_at: new Date(Date.now()),
          payment_result: {
            update: {
              status: order.payment_result?.status,
              update_time: order.payment_result?.update_time,
              email_address: order.payment_result?.email_address
            }
          }
        },
        include: {
          items: true,
          shipping_address: true,
          payment_result: true
          // user: true
        }
      })

      return order
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Updates an order to mark it as delivered.
   * @param {string} _id - The ID of the order to be updated.
   * @returns {Promise<any>} - A promise that resolves to the updated order object.
   */
  public async updateOrderToDelivered(_id?: string): Promise<any> {
    const order = await db.order.findFirst({ where: { id: _id } })
    if (order) {
      const updatedOrder = await db.order.update({
        where: {
          id: _id
        },
        data: {
          is_delivered: true,
          delivered_at: new Date()
        }
      })
      return updatedOrder
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
    const user = await db.user.findUnique({ where: { id: user_id } })

    if (!user) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const dataCart = await db.cart.findFirst({
      where: { user_id: user.id },
      include: { items: true }
    })

    if (!dataCart) {
      throw new Error('Cart not found for the user')
    }

    const orderItems = dataCart.items.map(item => ({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price
    }))

    const totalPrice = orderItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    )

    const createdOrder = await db.order.create({
      data: {
        user_id,
        username: user.username,
        email: user.email,
        items: {
          createMany: {
            data: orderItems
          }
        },
        shipping_address: {
          create: {
            address: body?.shipping_address?.address,
            city: body?.shipping_address?.city,
            postal_code: body?.shipping_address?.postal_code,
            country: body?.shipping_address?.country
          }
        },
        payment_method: body?.payment_method,
        payment_result: {
          create: {
            status: Constant.PAYMENT_STATUS.PENDING,
            update_time: new Date(Date.now()),
            email_address: user.email
          }
        },
        shipping_price: Constant.SHIPPING_PRICE,
        total_price: Number((totalPrice + Constant.SHIPPING_PRICE).toFixed(2)),
        is_paid: false
      }
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
    const user = await db.user.findUnique({ where: { id: user_id } })

    if (!user?.email) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const order = await db.order.findUnique({
      where: { id: order_id },
      include: { items: true }
    })

    if (!order) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const line_items = order.items.map(item => {
      if (
        !item.name ||
        !item.image ||
        item.price === null ||
        item.quantity === null
      ) {
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
    const user = await db.user.findFirstOrThrow({ where: { id: user_id } })
    const order = await db.order.findMany({ where: { user_id: user?.id } })
    if (!order) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return order
  }
}

export { OrderService }
