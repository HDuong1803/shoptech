import { CartService } from '@app'

describe('cart service', () => {
  /**
   * Declares variables for a cart service, user_id and product_id
   */
  let cartService: CartService
  let user_id = ''
  let product_id = ''
  /**
   * Runs before all tests in the file and initializes the admin user.
   */
  beforeAll(() => {
    cartService = new CartService()
    user_id = '65defc93ce29856a1d3d3687'
    product_id = '61fa962254d0d0a51edccd0c'
  })

  /**
   * Test to check if the cartService instance is of the correct type.
   */
  it('Check instance type', async () => {
    expect(cartService).toBeInstanceOf(CartService)
  })

  it('Get cart data', async () => {
    const cartData = await cartService.getCart(user_id)
    expect(cartData).toBeDefined()
  })

  it('Add to cart', async () => {
    const inputCartItem = {
      name: 'Product A',
      quantity: 2,
      image: 'product_a.jpg',
      price: 20
    }

    const result = await cartService.addToCart(
      user_id,
      inputCartItem,
      product_id
    )
    expect(result).toBeDefined()
  })

  // it('Update item quantity - increment', async () => {
  //   const result = await cartService.updateItemQuantity(
  //     user_id,
  //     product_id,
  //     'increment'
  //   )
  //   expect(result).toBeDefined()
  // })

  // it('Update item quantity - decrement', async () => {
  //   const result = await cartService.updateItemQuantity(
  //     user_id,
  //     product_id,
  //     'decrement'
  //   )
  //   expect(result).toBeDefined()
  // })

  it('Remove item from cart', async () => {
    const result = await cartService.removeItem(user_id, product_id)
    expect(result).toBeDefined()
  })
})
