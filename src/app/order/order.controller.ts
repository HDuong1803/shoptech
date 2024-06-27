import { type IOrders, InputOrderItem, type OutputCheckout } from '@app'
import { Constant, type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Middlewares,
  Request,
  Route,
  Security,
  Tags,
  Example,
  Response,
  Path,
  Put
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Order')
@Route('order')
@Security({
  authorization: []
})
@Middlewares([AuthMiddleware])
export class OrdersController extends Controller {
  @Get('/list')
  @Middlewares([AdminMiddleware])
  @Example<any>(
    {
      data: [
        {
          _id: '65eab62a50463e4846ce878a',
          user_id: '65defc93ce29856a1d3d3687',
          order_items: [
            {
              product_id: '61f65428e1273b6867abb86c',
              name: 'Microsoft Surface Laptop 13.5 inch',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
              price: 1599.99,
              _id: '65eab62a50463e4846ce878b'
            },
            {
              product_id: '61fabb3154d0d0a51edccee6',
              name: 'Apple iPhone XR Yellow 265GB',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x9c5978edd1988c392368804f31e3917a6243741cdc9a5d52774d6e9e602491a9',
              price: 399.99,
              _id: '65eab62a50463e4846ce878d'
            }
          ],
          shipping_address: {
            address: 'cau giay',
            city: 'ha noi',
            postal_code: '10000',
            country: 'Vietnam',
            _id: '65eab62a50463e4846ce878e'
          },
          payment_method: 'Credit Card',
          shipping_price: 0,
          total_price: 1999.98,
          is_paid: true,
          is_delivered: false,
          created_at: '2024-03-08T06:54:34.518Z',
          updated_at: '2024-03-08T06:54:34.518Z',
          __v: 0
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async getListOrders(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 5
  ): Promise<any> {
    try {
      const { data, total } = await Singleton.getOrderInstance().getListOrders(
        page,
        limit
      )
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/{id}')
  @Example<any>(
    {
      data: [
        {
          _id: '65eab62a50463e4846ce878a',
          user_id: '65defc93ce29856a1d3d3687',
          order_items: [
            {
              product_id: '61f65428e1273b6867abb86c',
              name: 'Microsoft Surface Laptop 13.5 inch',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
              price: 1599.99,
              _id: '65eab62a50463e4846ce878b'
            },
            {
              product_id: '61fabb3154d0d0a51edccee6',
              name: 'Apple iPhone XR Yellow 265GB',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x9c5978edd1988c392368804f31e3917a6243741cdc9a5d52774d6e9e602491a9',
              price: 399.99,
              _id: '65eab62a50463e4846ce878d'
            }
          ],
          shipping_address: {
            address: 'cau giay',
            city: 'ha noi',
            postal_code: '10000',
            country: 'Vietnam',
            _id: '65eab62a50463e4846ce878e'
          },
          payment_method: 'Credit Card',
          shipping_price: 0,
          total_price: 1999.98,
          is_paid: true,
          is_delivered: false,
          created_at: '2024-03-08T06:54:34.518Z',
          updated_at: '2024-03-08T06:54:34.518Z',
          __v: 0
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async getOrderById(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<Option<IOrders>> {
    try {
      const res = await Singleton.getOrderInstance().getOrder(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/{id}/pay')
  @Example<any>(
    {
      data: true,
      message: 'Success',
      count: 1,
      success: true
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  @Middlewares([AdminMiddleware])
  public async updateOrderToPaid(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<any> {
    try {
      const res = await Singleton.getOrderInstance().updateOrderToPaid(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/{id}/deliver')
  @Example<any>(
    {
      data: true,
      message: 'Success',
      count: 1,
      success: true
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  @Middlewares([AdminMiddleware])
  public async updateOrderToDelivered(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<any> {
    try {
      const res = await Singleton.getOrderInstance().updateOrderToDelivered(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/add')
  @Example<any>(
    {
      data: [
        {
          _id: '65eab62a50463e4846ce878a',
          user_id: '65defc93ce29856a1d3d3687',
          order_items: [
            {
              product_id: '61f65428e1273b6867abb86c',
              name: 'Microsoft Surface Laptop 13.5 inch',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
              price: 1599.99,
              _id: '65eab62a50463e4846ce878b'
            },
            {
              product_id: '61fabb3154d0d0a51edccee6',
              name: 'Apple iPhone XR Yellow 265GB',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x9c5978edd1988c392368804f31e3917a6243741cdc9a5d52774d6e9e602491a9',
              price: 399.99,
              _id: '65eab62a50463e4846ce878d'
            }
          ],
          shipping_address: {
            address: 'cau giay',
            city: 'ha noi',
            postal_code: '10000',
            country: 'Vietnam',
            _id: '65eab62a50463e4846ce878e'
          },
          payment_method: 'Credit Card',
          shipping_price: 0,
          total_price: 1999.98,
          is_paid: true,
          is_delivered: false,
          created_at: '2024-03-08T06:54:34.518Z',
          updated_at: '2024-03-08T06:54:34.518Z',
          __v: 0
        }
      ],
      success: true,
      message: 'Success',
      count: 1
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async addOrderItems(
    @Request() req: ExpressRequest,
    @Body() body: InputOrderItem
  ): Promise<Option<IOrders>> {
    try {
      const user_id = req.headers.id as string
      const data = await Singleton.getOrderInstance().addOrderItems(
        body,
        user_id
      )
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/')
  @Example<any>(
    {
      data: [
        {
          _id: '65eab62a50463e4846ce878a',
          user_id: '65defc93ce29856a1d3d3687',
          order_items: [
            {
              product_id: '61f65428e1273b6867abb86c',
              name: 'Microsoft Surface Laptop 13.5 inch',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
              price: 1599.99,
              _id: '65eab62a50463e4846ce878b'
            },
            {
              product_id: '61fabb3154d0d0a51edccee6',
              name: 'Apple iPhone XR Yellow 265GB',
              quantity: 1,
              image:
                'https://hd-ecommerce.s3.amazonaws.com/0x9c5978edd1988c392368804f31e3917a6243741cdc9a5d52774d6e9e602491a9',
              price: 399.99,
              _id: '65eab62a50463e4846ce878d'
            }
          ],
          shipping_address: {
            address: 'cau giay',
            city: 'ha noi',
            postal_code: '10000',
            country: 'Vietnam',
            _id: '65eab62a50463e4846ce878e'
          },
          payment_method: 'Credit Card',
          shipping_price: 0,
          total_price: 1999.98,
          is_paid: true,
          is_delivered: false,
          created_at: '2024-03-08T06:54:34.518Z',
          updated_at: '2024-03-08T06:54:34.518Z',
          __v: 0
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async getOrderOfUser(@Request() req: ExpressRequest): Promise<any> {
    try {
      const user_id = req.headers.id as string
      const res = await Singleton.getOrderInstance().getOrderOfUser(user_id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/checkout')
  @Example<any>(
    {
      data: 'https://checkout.stripe.com/c/pay/cs_test_b14kCbaM3bYnrM8eRYpKgO4JuP2Aa8xSozca9xovOxWufeK52J5Tt1Cp7m#fidkdWxOYHwnPyd1blpxYHZxWjA0T3VxPEJASUBgdmpuY0xVUGpPTlAyN1x2QWdhSGNiZ2drXXRJUXNkbnUwfVVqb0JscD1PQnd9MlR0SFBnbVBtVDB2cTFiSH8wQkYxX2dPSmdLTDc3XWpENTVCUUNhYXRvdScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl',
      message: 'Success',
      count: 1,
      success: true
    },
    'Success'
  )
  @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  })
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async getCheckout(
    @Request() req: ExpressRequest,
    @Query() order_id: string
  ): Promise<Option<OutputCheckout>> {
    try {
      const user_id = req.headers.id as string
      const data = await Singleton.getOrderInstance().getCheckout(
        user_id,
        order_id
      )
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
