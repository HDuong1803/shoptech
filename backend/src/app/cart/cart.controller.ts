import { InputCartItem } from '@app'
import { type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
// import {
  // AdminMiddleware,
  // AuthMiddleware
// } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Get,
  Post,
  // Middlewares,
  Request,
  Route,
  // Security,
  Tags,
  Delete,
  Put,
  Query,
  Body,
  BodyProp,
} from 'tsoa'

@Tags('Cart')
@Route('cart')
// @Security({
//   authorization: []
// })
  // @Middlewares([AuthMiddleware])

export class CartController extends Controller {
  @Get('/')
  public async getCart(
    @Request() req: ExpressRequest,
  ): Promise<Option<any>> {
    try {
      const authorization = req.headers.authorization as string
      const data = await Singleton.getCartInstance().getCart(authorization)
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/add')
  public async addToCart(
    @Request() req: ExpressRequest,
    @Body() body: InputCartItem,
    @Query() product_id: string
  ): Promise<Option<any>> {
    try {
      const authorization = req.headers.authorization as string
      const res = await Singleton.getCartInstance().addToCart(
        authorization,
        body,
        product_id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
  @Put('/quantity')
  public async updateItemQuantity(
    @Request() req: ExpressRequest,
    @Query() product_id: string,
    @BodyProp() action: string
  ): Promise<Option<any>> {
    try {
      const authorization = req.headers.authorization as string
      const res = await Singleton.getCartInstance().updateItemQuantity(
        authorization,
        product_id,
        action
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Delete('/item')
  public async removeItem(
    @Request() req: ExpressRequest,
    @Query() product_id: string
  ): Promise<Option<any>> {
    try {
      const authorization = req.headers.authorization as string
      const res = await Singleton.getCartInstance().removeItem(
        authorization,
        product_id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
