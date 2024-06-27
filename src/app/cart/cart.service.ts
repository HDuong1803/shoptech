import { type InputCartItem } from '@app'
import { Constant } from '@constants'
import { db } from '@utils'

class CartService {
  public async getCart(user_id?: string): Promise<any> {
    const user = await db.user.findFirst({ where: { id: user_id } })
    const dataCart = await db.cart.findFirst({ where: { user_id: user?.id } })
    if (!dataCart) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return dataCart
  }

  public async addToCart(
    user_id?: string,
    body?: InputCartItem,
    product_id?: string
  ): Promise<any> {
    const user = await db.user.findUnique({ where: { id: user_id } })
    if (!user) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }

    const existingCart = await db.cart.findFirst({
      where: {
        user_id: user?.id,
        items: {
          some: { product_id }
        }
      }
    })

    if (existingCart) {
      const result = await db.cart.update({
        where: {
          id: existingCart.id
        },
        data: {
          items: {
            updateMany: {
              where: { product_id },
              data: { quantity: { increment: 1 } }
            }
          }
        }
      })

      return result
    } else {
      const result = await db.cart.create({
        data: {
          user: { connect: { id: user?.id } },
          items: {
            create: {
              product_id,
              name: body?.name,
              quantity: body?.quantity ?? 1,
              image: body?.image,
              price: body?.price
            }
          }
        },
        include: {
          items: true
        }
      })

      return result
    }
  }

  // public async updateItemQuantity(
  //   user_id: string,
  //   product_id: string,
  //   action: string
  // ): Promise<any> {
  //   const user = await db.user.findFirst({
  //     where: {
  //       id: user_id
  //     }
  //   })

  //   const userCart = await db.user.findFirst({
  //     where: {
  //       id: user?.id
  //     }
  //   })

  //   if (!userCart) {
  //     throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  //   }
  //   const cartItemIndex =
  //     userCart.cart?.findIndex(
  //       item => item.product_id?.toString() === product_id
  //     ) ?? 0
  //   if (cartItemIndex !== -1) {
  //     if (!userCart.cart) {
  //       throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  //     }
  //     let updatedQuantity = userCart.cart[cartItemIndex].quantity
  //     if (updatedQuantity && action === 'increment') {
  //       updatedQuantity = updatedQuantity + 1
  //     } else if (updatedQuantity && action === 'decrement') {
  //       updatedQuantity = updatedQuantity - 1
  //       if (updatedQuantity < 1) {
  //         return 0
  //       }
  //     } else {
  //       throw new Error(Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR)
  //     }
  //     userCart.cart[cartItemIndex].quantity = updatedQuantity
  //     const result = await userCart.save()
  //     return result
  //   } else {
  //     throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  //   }
  // }

  public async removeItem(user_id: string, product_id: string): Promise<any> {
    const user = await db.user.findUnique({ where: { id: user_id } })

    if (!user) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }

    const userCart = await db.cart.findFirst({
      where: {
        user_id: user.id
      },
      include: {
        items: true
      }
    })

    if (!userCart) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const foundItemIndex = userCart.items.findIndex(
      item => item.product_id === product_id
    )

    if (foundItemIndex !== -1) {
      const updatedItems = [...userCart.items]
      updatedItems.splice(foundItemIndex, 1)

      const result = await db.cart.update({
        where: {
          id: userCart.id
        },
        data: {
          items: {
            deleteMany: {
              id: userCart.items[foundItemIndex].id
            }
          }
        },
        include: {
          items: true
        }
      })

      return result
    } else {
      throw new Error('Item not found in the cart')
    }
  }
}

export { CartService }
