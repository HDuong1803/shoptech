import { IOrders, InputOrderItem } from '@app'
import { type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Body,
  Controller,
  Example,
  Get,
  Query,
  Post,
  Middlewares,
  Request,
  Response,
  Route,
  Security,
  Tags,
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
  @Post('/add')
  @Example<Option<any>>({
    data: {
      _id: '64cb170a7422d358400df762',
      user_id: '64c87021dd08b118fc16339f',
      orderItems: [
        {
          product_id: '61f65428e1273b6867abb86c',
          name: 'Microsoft Surface Laptop 13.5 inch',
          quantity: 2,
          image: '/images/surface.jpeg',
          price: 3199.98,
          _id: '64cb170a7422d358400df763'
        }
      ],
      shippingAddress: {
        _id: '64cb170a7422d358400df764',
        address: 'Cau Giay',
        city: 'Ha Noi'
      },
      paymentMethod: 'QRPAY',
      shippingPrice: 0,
      totalPrice: 3199.98,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    },
    success: true,
    message: 'Success',
    count: 1
  })
  @Example<Option<any>>(
    {
      data: {
        id: 1,
        username: 'administrator',
        name: 'admin',
        role: 1
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Admin'
  )
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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

  @Get('/list')
  @Middlewares([AdminMiddleware])
  @Example<Option<any>>({
    data: [
      {
        _id: '64cb170a7422d358400df762',
        user_id: '64c87021dd08b118fc16339f',
        orderItems: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 2,
            image: '/images/surface.jpeg',
            price: 3199.98,
            _id: '64cb170a7422d358400df763'
          }
        ],
        shippingAddress: {
          address: 'Cau Giay',
          city: 'Ha Noi',
          _id: '64cb170a7422d358400df764'
        },
        paymentMethod: 'Cod',
        shippingPrice: 0,
        totalPrice: 3199.98,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      }
    ],
    success: true,
    message: 'Success',
    count: 1,
    total: 1
  })
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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
  @Example<Option<any>>({
    data: [
      {
        _id: '64cb170a7422d358400df762',
        user_id: '64c87021dd08b118fc16339f',
        orderItems: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 2,
            image: '/images/surface.jpeg',
            price: 3199.98,
            _id: '64cb170a7422d358400df763'
          }
        ],
        shippingAddress: {
          address: 'Cau Giay',
          city: 'Ha Noi',
          _id: '64cb170a7422d358400df764'
        },
        paymentMethod: 'Cod',
        shippingPrice: 0,
        totalPrice: 3199.98,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      }
    ],
    success: true,
    message: 'Success',
    count: 1,
    total: 1
  })
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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

  @Get('/myorders')
  @Example<Option<any>>({
    data: [
      {
        _id: '64cb170a7422d358400df762',
        user_id: '64c87021dd08b118fc16339f',
        orderItems: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 2,
            image: '/images/surface.jpeg',
            price: 3199.98,
            _id: '64cb170a7422d358400df763'
          }
        ],
        shippingAddress: {
          address: 'Cau Giay',
          city: 'Ha Noi',
          _id: '64cb170a7422d358400df764'
        },
        paymentMethod: 'Cod',
        shippingPrice: 0,
        totalPrice: 3199.98,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      }
    ],
    success: true,
    message: 'Success',
    count: 1,
    total: 1
  })
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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

  @Put('/{id}/pay')
  @Middlewares([AdminMiddleware])
  @Example<Option<any>>({
    data: [
      {
        _id: '64cb170a7422d358400df762',
        user_id: '64c87021dd08b118fc16339f',
        orderItems: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 2,
            image: '/images/surface.jpeg',
            price: 3199.98,
            _id: '64cb170a7422d358400df763'
          }
        ],
        shippingAddress: {
          address: 'Cau Giay',
          city: 'Ha Noi',
          _id: '64cb170a7422d358400df764'
        },
        paymentMethod: 'Cod',
        shippingPrice: 0,
        totalPrice: 3199.98,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      }
    ],
    success: true,
    message: 'Success',
    count: 1,
    total: 1
  })
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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
  @Example<Option<any>>({
    data: [
      {
        _id: '64cb170a7422d358400df762',
        user_id: '64c87021dd08b118fc16339f',
        orderItems: [
          {
            product_id: '61f65428e1273b6867abb86c',
            name: 'Microsoft Surface Laptop 13.5 inch',
            quantity: 2,
            image: '/images/surface.jpeg',
            price: 3199.98,
            _id: '64cb170a7422d358400df763'
          }
        ],
        shippingAddress: {
          address: 'Cau Giay',
          city: 'Ha Noi',
          _id: '64cb170a7422d358400df764'
        },
        paymentMethod: 'Cod',
        shippingPrice: 0,
        totalPrice: 3199.98,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      }
    ],
    success: true,
    message: 'Success',
    count: 1,
    total: 1
  })
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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
}
