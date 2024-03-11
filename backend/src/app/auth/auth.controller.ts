import {
  InputLoginAdmin,
  InputRefreshToken,
  InputVerifyPassword,
  OutputLoginUser,
  OutputVerifyPassword,
  VerifyGoogleInput,
  type OutputLogout,
  type OutputRefreshToken,
} from '@app'
import {
  Constant,
  logError,
  onError,
  onSuccess,
  type Option
} from '@constants'
import { AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Body,
  Controller,
  Middlewares,
  Post,
  Request,
  Route,
  Security,
  Tags,
  Example,
  Response
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant
@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {

  @Post('admin/login')
  @Example<any>(
    {
      data: {
        detail: {
          _id: "65dc4e4cc7d2ffcebd571312",
          username: "admin",
          email: "administrator@gmail.com",
          password: "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a",
          role: 1,
          phone: "0000000000",
          refresh_token: "",
          createdAt: "2024-02-26T08:39:40.396Z",
          updatedAt: "2024-03-11T02:49:46.679Z",
          __v: 0,
          last_login_at: "2024-03-11T02:49:46.663Z"
        },
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluaXN0cmF0b3JAZ21haWwuY29tIiwicm9sZSI6MSwicGhvbmUiOiIwMDAwMDAwMDAwIiwiaWF0IjoxNzEwMTI1Mzg2LCJleHAiOjE3MTAyMTE3ODZ9.bcgqZInCv1oKmT-Re7PQLkiuN7Ig4MbteO1IgC7uI1k",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluaXN0cmF0b3JAZ21haWwuY29tIiwicm9sZSI6MSwicGhvbmUiOiIwMDAwMDAwMDAwIiwiaWF0IjoxNzEwMTI1Mzg2LCJleHAiOjE3MTA3MzAxODZ9.zvH3sUppqm6HDh1X0Fi7eJIeb88ST-BUbkDfX7Ba3Zw"
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
  public async loginAdmin(
    @Request() req: ExpressRequest,
    @Body() body: InputLoginAdmin
  ): Promise<any> {
    try {
      const res = await Singleton.getAuthInstance().loginAdmin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('admin/token')
  @Example<any>(
    {
      data: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluaXN0cmF0b3JAZ21haWwuY29tIiwicm9sZSI6MSwiaWF0IjoxNzEwMTI1NTE1LCJleHAiOjE3MTAyMTE5MTV9.9E2zPNo8La-wS5eQThyLHrmZuFzD732SYFUbW9cetNE"
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
  public async refreshTokenAdmin(
    @Request() req: ExpressRequest, 
    @Body() body: InputRefreshToken
  ): Promise<Option<OutputRefreshToken>> {
    try {
      const res = await Singleton.getAuthInstance().refreshToken(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('verify/password')
  @Example<any>(
    {
      data: {
        authorized: true
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  @Security({
    authorization: []
  })
  @Middlewares([AuthMiddleware])
  public async verifyPassword(
    @Request() req: ExpressRequest,
    @Body() body: InputVerifyPassword
  ): Promise<Option<OutputVerifyPassword>> {
    try {
      const id = req.headers.id as string
      const res = await Singleton.getAuthInstance().verifyPassword(
        body,
        id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('logout')
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async logout(
    @Request() req: ExpressRequest
  ): Promise<Option<OutputLogout>> {
    try {
      const authorization = req.headers.authorization as string
      const res = await Singleton.getAuthInstance().logout(authorization)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('user/login/google')
  @Example<any>(
    {
      data: {
        detail: null,
        access_token: null,
        refresh_token: null
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
  @Response<any>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async loginGoogle(
    @Body() payload: VerifyGoogleInput,
    @Request() req: ExpressRequest
  ): Promise<Option<OutputLoginUser>> {
    try {
      const res = await Singleton.getAuthInstance().verifyGoogle(
        payload.google_token_id,
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('user/token')
  @Example<any>(
    {
      data: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaXN0cmF0b3IiLCJyb2xlIjoxLCJhZGRyZXNzIjoiMHgzYzkwZDhiZTQ1NzNmMDU4MmEyNjEzZTVjZWZlODcyNzQzMWRiMmYyIiwiaWF0IjoxNjg3MjI2NjI4LCJleHAiOjE2ODczMTMwMjh9.vvYNZdJEoNPoW7R9N0G9QDCzlGvq_oI0NBLLWSodWdB'
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Access token'
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
  public async refreshTokenUser(
    @Request() req: ExpressRequest,
    @Body() body: InputRefreshToken
  ): Promise<Option<OutputRefreshToken>> {
    return await this.refreshTokenAdmin(req, body)
  }
}
