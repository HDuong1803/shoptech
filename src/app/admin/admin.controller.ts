import type { Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Get,
  Middlewares,
  Request,
  Route,
  Security,
  Tags,
  Example,
  Response
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Admin')
@Route('admin')
@Security({
  authorization: []
})
@Middlewares([AuthMiddleware, AdminMiddleware])
export class AdminController extends Controller {
  @Get('info')
  @Example<any>(
    {
      data: {
        _id: '65dc4e4cc7d2ffcebd571312',
        email: 'administrator@gmail.com',
        username: 'admin',
        role: 1,
        phone: '0000000000',
        refresh_token: '',
        update_at: new Date(),
        create_at: new Date()
      },
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
  public async infoAdmin(@Request() req: ExpressRequest): Promise<Option<any>> {
    try {
      const res = await Singleton.getAdminInstance().infoAdmin()
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
