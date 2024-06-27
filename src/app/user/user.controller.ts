import { InputUpdateUser, type IUser, type OutputListUser } from '@app'
import { Constant, type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Controller,
  Get,
  Query,
  Middlewares,
  Request,
  Route,
  Security,
  Tags,
  Example,
  Response,
  Put,
  Body
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('User')
@Route('user')
export class UserController extends Controller {
  @Security({
    authorization: []
  })
  @Middlewares([AuthMiddleware])
  @Get('/profile')
  @Example<any>(
    {
      data: {
        _id: '65defc93ce29856a1d3d3687',
        username: 'Hai Duong',
        email: 'dohaiduong@gmail.com',
        password:
          '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        role: 0,
        phone: '0123456789',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk',
        created_at: '2024-02-28T09:27:47.341Z',
        updated_at: '2024-02-28T09:27:47.341Z',
        __v: 0
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
  public async getUser(@Request() req: ExpressRequest): Promise<Option<IUser>> {
    try {
      const user_id = req.headers.id as string
      const result = await Singleton.getUserInstance().getUser(user_id)
      return onSuccess(result)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/list/profile')
  @Middlewares([AdminMiddleware])
  @Example<any>(
    {
      data: [
        {
          _id: '65dc4e4cc7d2ffcebd571312',
          username: 'admin',
          email: 'administrator@gmail.com',
          password:
            '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
          role: 1,
          phone: '0000000000',
          refresh_token:
            '0xb847a239586a0166465cc55cc329e584cc6267eb00070c292d0f9bcb8624e369',
          created_at: '2024-02-26T08:39:40.396Z',
          updated_at: '2024-03-11T02:49:46.992Z',
          __v: 0,
          last_login_at: '2024-03-11T02:49:46.663Z'
        },
        {
          _id: '65defc93ce29856a1d3d3687',
          username: 'Hai Duong',
          email: 'dohaiduong@gmail.com',
          password:
            '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
          role: 0,
          phone: '0123456789',
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk',
          created_at: '2024-02-28T09:27:47.341Z',
          updated_at: '2024-02-28T09:27:47.341Z',
          __v: 0
        }
      ],
      success: true,
      message: 'Success',
      count: 2,
      total: 2
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
  public async getListUser(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 5
  ): Promise<Option<OutputListUser>> {
    try {
      const { data, total } = await Singleton.getUserInstance().getListUser(
        page,
        limit
      )
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/profile')
  @Example<any>(
    {
      data: {
        _id: '65defc93ce29856a1d3d3687',
        username: 'Hai Duong',
        email: 'dohaiduong@gmail.com',
        password:
          '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        role: 0,
        phone: '0123456789',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk',
        created_at: '2024-02-28T09:27:47.341Z',
        updated_at: '2024-02-28T09:27:47.341Z',
        __v: 0
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
  public async updateUser(
    @Request() req: ExpressRequest,
    @Body() body: InputUpdateUser
  ): Promise<Option<IUser>> {
    try {
      const user_id = req.headers.id as string
      const result = await Singleton.getUserInstance().updateUser(user_id, body)
      return onSuccess(result)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
