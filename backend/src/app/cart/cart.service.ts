// import { authUser } from '@constants'
import { InputCartItem } from '@app'
import { Constant, authUser } from '@constants'
import { CartDB } from '@schemas'

class CartService {
  public async getCart(authorization?: string): Promise<any> {
    const user = await authUser(authorization as string)
    const dataCart = await CartDB.findOne({ user_id: user?._id })
    if (!dataCart) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    return dataCart.toJSON()
  }

  public async addToCart(
    authorization?: string,
    body?: InputCartItem,
    product_id?: string
  ): Promise<any> {
    const user = await authUser(authorization as string)
    const existingProduct = await CartDB.findOne({
      user_id: user?._id,
      'cart.product_id': product_id
    })

    if (existingProduct) {
      const result = await CartDB.findOneAndUpdate(
        {
          user_id: user?._id,
          'cart.product_id': product_id
        },
        {
          $inc: { 'cart.$.quantity': 1 }
        },
        { new: true }
      )

      return result
    } else {
      const result = await CartDB.findOneAndUpdate(
        { user_id: user?._id },
        {
          $push: {
            cart: {
              product_id,
              name: body?.name,
              quantity: body?.quantity || 1,
              image: body?.image,
              price: body?.price
            }
          }
        },
        { upsert: true, new: true }
      )

      return result
    }
  }

  public async updateItemQuantity(
    authorization: string,
    product_id: string,
    action: string
  ): Promise<any> {
    const user = await authUser(authorization as string)
    const userCart = await CartDB.findOne({ user_id: user?._id })

    if (!userCart) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    const cartItemIndex =
      userCart.cart?.findIndex(
        item => item.product_id?.toString() === product_id
      ) || 0
    if (cartItemIndex !== -1) {
      if (!userCart.cart) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
      }
      let updatedQuantity = userCart.cart[cartItemIndex].quantity
      if (updatedQuantity && action === 'increment') {
        updatedQuantity = updatedQuantity + 1
      } else if (updatedQuantity && action === 'decrement') {
        updatedQuantity = updatedQuantity - 1
        if (updatedQuantity < 1) {
          return 0
        }
      } else {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR)
      }
      userCart.cart[cartItemIndex].quantity = updatedQuantity
      const result = await userCart.save()
      return result
    } else {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
  }

  public async removeItem(authorization: string,
    product_id: string): Promise<any> {
      const user = await authUser(authorization as string)
      const userCart = await CartDB.findOne({ user_id: user?._id })
      if (!userCart) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
      }
      const cartItemIndex =
        userCart.cart?.findIndex(
          item => item.product_id?.toString() === product_id
        ) || 0
      if (cartItemIndex !== -1) {
        if (!userCart.cart) {
          throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
        }
        userCart.cart?.splice(cartItemIndex, 1);
        const result = await userCart.save()
        return result
      } else {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
      }
    }
}

export { CartService }
