import { InputCartItem } from '@app'
import { Constant, type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Get,
  Post,
  Middlewares,
  Request,
  Route,
  Security,
  Tags,
  Example,
  Response,
  Delete,
  // Put,
  Query,
  Body
  // BodyProp
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Cart')
@Route('cart')
@Security({
  authorization: []
})
@Middlewares([AuthMiddleware])
export class CartController extends Controller {
  @Get('/')
  @Example<any>(
    {
      data: {
        _id: '65e04f439a3253299c1193db',
        user_id: '65defc93ce29856a1d3d3687',
        __v: 68,
        cart: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 1,
            image:
              'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
            price: 1599.99,
            _id: '65e7f81a6e317fe013f7ca6d'
          }
        ]
      },
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
  public async getCart(@Request() req: ExpressRequest): Promise<Option<any>> {
    try {
      const user_id = req.headers.id as string
      const data = await Singleton.getCartInstance().getCart(user_id)
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/add')
  @Example<any>(
    {
      data: {
        _id: '65e04f439a3253299c1193db',
        user_id: '65defc93ce29856a1d3d3687',
        __v: 68,
        cart: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 1,
            image:
              'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
            price: 1599.99,
            _id: '65e7f81a6e317fe013f7ca6d'
          },
          {
            product_id: '61fa938354d0d0a51edcccac',
            name: 'Apple iMac 27-inch 3.3 GHz',
            quantity: 1,
            image:
              'https://hd-ecommerce.s3.amazonaws.com/0x839a5febb5a7c5a60739a35e50367737656541afe7a1281e875035677245bcdb',
            price: 2049.99,
            _id: '65eab5ab50463e4846ce8736'
          }
        ]
      },
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
  public async addToCart(
    @Request() req: ExpressRequest,
    @Body() body: InputCartItem,
    @Query() product_id: string
  ): Promise<Option<any>> {
    try {
      const user_id = req.headers.id as string
      const res = await Singleton.getCartInstance().addToCart(
        user_id,
        body,
        product_id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  // @Put('/quantity')
  // @Example<any>(
  //   {
  //     data: {
  //       _id: '65e04f439a3253299c1193db',
  //       user_id: '65defc93ce29856a1d3d3687',
  //       __v: 68,
  //       cart: [
  //         {
  //           product_id: '61f65428e1273b6867abb86c',
  //           name: 'Microsoft Surface Laptop 13.5 inch',
  //           quantity: 2,
  //           image:
  //             'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
  //           price: 1599.99,
  //           _id: '65e7f81a6e317fe013f7ca6d'
  //         }
  //       ]
  //     },
  //     success: true,
  //     message: 'Success',
  //     count: 1
  //   },
  //   'Success'
  // )
  // @Response<any>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
  //   success: false,
  //   message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  // })
  // @Response<any>('422', NETWORK_STATUS_MESSAGE.VALIDATE_ERROR, {
  //   success: false,
  //   message: NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
  // })
  // @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
  //   success: false,
  //   message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  // })
  // public async updateItemQuantity(
  //   @Request() req: ExpressRequest,
  //   @Query() product_id: string,
  //   @BodyProp() action: string
  // ): Promise<Option<any>> {
  //   try {
  //     const user_id = req.headers.id as string
  //     const res = await Singleton.getCartInstance().updateItemQuantity(
  //       user_id,
  //       product_id,
  //       action
  //     )
  //     return onSuccess(res)
  //   } catch (error: any) {
  //     logError(error, req)
  //     return onError(error, this)
  //   }
  // }

  @Delete('/item')
  @Example<any>(
    {
      data: [],
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
  public async removeItem(
    @Request() req: ExpressRequest,
    @Query() product_id: string
  ): Promise<Option<any>> {
    try {
      const user_id = req.headers.id as string
      const res = await Singleton.getCartInstance().removeItem(
        user_id,
        product_id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
