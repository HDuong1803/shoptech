import { IOrders, InputOrderItem } from '@app'
import { type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, 
  // AuthMiddleware 
} from '@middlewares'
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
  // Security,
  Tags,
  Path,
  Put
} from 'tsoa'

@Tags('Order')
@Route('order')
// @Security({
//   authorization: []
// })
// @Middlewares([AuthMiddleware])
export class OrdersController extends Controller {
  @Get('/list')
  @Middlewares([AdminMiddleware])
  public async getListOrders(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 5
  ): Promise<Option<any>> {
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
  @Middlewares([AdminMiddleware])
  public async getOrderById(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<Option<IOrders>> {
    try {
      const res = await Singleton.getOrderInstance().getOrderById(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/{id}/pay')
  @Middlewares([AdminMiddleware])
  public async updateOrderToPaid(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<Option<IOrders>> {
    try {
      const res = await Singleton.getOrderInstance().updateOrderToPaid(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/{id}/deliver')
  @Middlewares([AdminMiddleware])
  public async updateOrderToDelivered(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<Option<IOrders>> {
    try {
      const res = await Singleton.getOrderInstance().updateOrderToDelivered(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
  @Post('/add')
  public async addOrderItems(
    @Request() req: ExpressRequest,
    @Body() body: InputOrderItem
  ): Promise<Option<IOrders>> {
    try {
      const { user_id, product_id } = req.body
      const data = await Singleton.getOrderInstance().addOrderItems(
        body,
        user_id,
        product_id
      )
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/myorders')
  public async getOrderOfUser(
    @Request() req: ExpressRequest
  ): Promise<Option<IOrders>> {
    try {
      const id = req.body as string
      const res = await Singleton.getOrderInstance().getOrderOfUser(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/checkout')
  public async getCheckout(
    @Request() req: ExpressRequest,
    @Query() user_id: string,
    @Query() order_id: string
  ): Promise<Option<IOrders>> {
    try {
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
