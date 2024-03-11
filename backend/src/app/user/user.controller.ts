import {
  IUser,
  InputLogin,
  InputSignUp,
  OutputListUser,
  OutputLogin,
  OutputSignUp,
} from '@app'
import { Constant, type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, 
  AuthMiddleware
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
  Security,
  Tags,
  Example,
  Response,
  Put,
  BodyProp
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant


@Tags('User')
@Route('user')
export class UserController extends Controller {
  @Post('/signup')
  @Example<any>(
    {
      data: {
        detail: {
          username: "Hai Duong",
          email: "dohaiduong@gmail.com",
          password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a",
          role: 0,
          phone: "0123456789",
          refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmcxODAzQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMDEyOTk3MiwiZXhwIjoxNzEwNzM0NzcyfQ.aVAEsX70x0dnPCj5RENYopsUSZj-iAOrYy7pjaZFZ9g",
          _id: "65ee83346d40675eb65026b0",
          createdAt: "2024-03-11T04:06:12.649Z",
          updatedAt: "2024-03-11T04:06:12.649Z",
          __v: 0
        },
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmcxODAzQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMDEyOTk3MiwiZXhwIjoxNzEwMjE2MzcyfQ.y5LnnlMMY1SqwLQCm87c6XTAw4qSsg7GBPbi7Z2tX_E",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmcxODAzQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMDEyOTk3MiwiZXhwIjoxNzEwNzM0NzcyfQ.aVAEsX70x0dnPCj5RENYopsUSZj-iAOrYy7pjaZFZ9g"
      },
      success: true,
      message: "Success",
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async userSignUp(
    @Request() req: ExpressRequest,
    @Body() body: InputSignUp
  ): Promise<Option<OutputSignUp>> {
    try {
      const res = await Singleton.getUserInstance().userSignUp(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/login')
  @Example<any>(
    {
      data: {
        detail: {
          _id: "65defc93ce29856a1d3d3687",
          password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a"
        },
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAxMzAwNTksImV4cCI6MTcxMDIxNjQ1OX0.pZ3As0GmbqlMf0i1veMyGxma-e5AK74hC3a25ObRnSg",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAxMzAwNTksImV4cCI6MTcxMDczNDg1OX0.2Pl02EpIU3unkLgmMiU5O5ANEDOvv0bmxAN-1s-x9ws"
      },
      success: true,
      message: "Success",
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async userLogin(
    @Request() req: ExpressRequest,
    @Body() body: InputLogin
  ): Promise<Option<OutputLogin>> {
    try {
      const res = await Singleton.getUserInstance().userLogin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
  @Security({
    authorization: []
  })
  @Middlewares([AuthMiddleware])
  @Get('/profile')
  @Example<any>(
    {
      data: {
        _id: "65defc93ce29856a1d3d3687",
        username: "Hai Duong",
        email: "dohaiduong@gmail.com",
        password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a",
        role: 0,
        phone: "0123456789",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk",
        createdAt: "2024-02-28T09:27:47.341Z",
        updatedAt: "2024-02-28T09:27:47.341Z",
        __v: 0
      },
      success: true,
      message: "Success",
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
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
          _id: "65dc4e4cc7d2ffcebd571312",
          username: "admin",
          email: "administrator@gmail.com",
          password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a",
          role: 1,
          phone: "0000000000",
          refresh_token: "0xb847a239586a0166465cc55cc329e584cc6267eb00070c292d0f9bcb8624e369",
          createdAt: "2024-02-26T08:39:40.396Z",
          updatedAt: "2024-03-11T02:49:46.992Z",
          __v: 0,
          last_login_at: "2024-03-11T02:49:46.663Z"
        },
        {
          _id: "65defc93ce29856a1d3d3687",
          username: "Hai Duong",
          email: "dohaiduong@gmail.com",
          password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a",
          role: 0,
          phone: "0123456789",
          refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk",
          createdAt: "2024-02-28T09:27:47.341Z",
          updatedAt: "2024-02-28T09:27:47.341Z",
          __v: 0
        }
      ],
      success: true,
      message: "Success",
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
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
        _id: "65defc93ce29856a1d3d3687",
        username: "Hai Duong",
        email: "dohaiduong@gmail.com",
        password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a",
        role: 0,
        phone: "0123456789",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk",
        createdAt: "2024-02-28T09:27:47.341Z",
        updatedAt: "2024-02-28T09:27:47.341Z",
        __v: 0
      },
      success: true,
      message: "Success",
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async updateUser(
    @Request() req: ExpressRequest,
    @BodyProp() name: string,
    @BodyProp() password: string,
    @BodyProp() phone: string
  ): Promise<Option<IUser>> {
    try {
      const user_id = req.headers.id as string
      const result = await Singleton.getUserInstance().updateUser(
        user_id,
        name,
        phone,
        password
      )
      return onSuccess(result)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
