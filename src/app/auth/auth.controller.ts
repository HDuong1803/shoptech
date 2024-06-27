import {
  InputRefreshToken,
  InputVerifyPassword,
  VerifyGoogleInput,
  inputLoginValidate,
  InputLogin,
  InputSignUp,
  type OutputLoginUser,
  type OutputVerifyPassword,
  type OutputLogout,
  type OutputRefreshToken,
  type OutputLogin,
  type OutputSignUp
} from '@app'
import {
  Constant,
  ErrorHandler,
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
  /**
   * Logs in an user and returns either an authentication token or the user information.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputLoginAdmin} body - The login credentials for the admin user.
   * @returns {Promise<Option<string | IUser>>} - A promise that resolves to either an authentication token or the admin user's information.
   * @throws {UnauthorizedError} - If the user is not authorized to access the user information.
   * @throws {NotFoundError} - If the user is not found.
   * @throws {ValidationError} - If there is a validation error with the request.
   * @throws {InternalServerError} - If there is an internal server error.
   */
  @Post('/login')
  @Example<any>(
    {
      data: {
        detail: {
          _id: '65defc93ce29856a1d3d3687',
          password:
            '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a'
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAxMzAwNTksImV4cCI6MTcxMDIxNjQ1OX0.pZ3As0GmbqlMf0i1veMyGxma-e5AK74hC3a25ObRnSg',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAxMzAwNTksImV4cCI6MTcxMDczNDg1OX0.2Pl02EpIU3unkLgmMiU5O5ANEDOvv0bmxAN-1s-x9ws'
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
  public async userLogin(
    @Request() req: ExpressRequest,
    @Body() body: InputLogin
  ): Promise<Option<OutputLogin>> {
    try {
      /**
       * Validates the input login admin body and throws an error if it is invalid.
       */
      const validate = inputLoginValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      /**
       * Logs in the admin user using the provided credentials.
       */
      const res = await Singleton.getAuthInstance().userLogin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('user/signup')
  @Example<any>(
    {
      data: {
        detail: {
          username: 'Hai Duong',
          email: 'dohaiduong@gmail.com',
          password:
            '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
          role: 0,
          phone: '0123456789',
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmcxODAzQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMDEyOTk3MiwiZXhwIjoxNzEwNzM0NzcyfQ.aVAEsX70x0dnPCj5RENYopsUSZj-iAOrYy7pjaZFZ9g',
          _id: '65ee83346d40675eb65026b0',
          created_at: '2024-03-11T04:06:12.649Z',
          updated_at: '2024-03-11T04:06:12.649Z',
          __v: 0
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmcxODAzQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMDEyOTk3MiwiZXhwIjoxNzEwMjE2MzcyfQ.y5LnnlMMY1SqwLQCm87c6XTAw4qSsg7GBPbi7Z2tX_E',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmcxODAzQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMDEyOTk3MiwiZXhwIjoxNzEwNzM0NzcyfQ.aVAEsX70x0dnPCj5RENYopsUSZj-iAOrYy7pjaZFZ9g'
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
  public async userSignUp(
    @Request() req: ExpressRequest,
    @Body() body: InputSignUp
  ): Promise<Option<OutputSignUp>> {
    try {
      const res = await Singleton.getAuthInstance().userSignUp(body)
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
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluaXN0cmF0b3JAZ21haWwuY29tIiwicm9sZSI6MSwiaWF0IjoxNzEwMTI1NTE1LCJleHAiOjE3MTAyMTE5MTV9.9E2zPNo8La-wS5eQThyLHrmZuFzD732SYFUbW9cetNE'
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

  /**
   * Verifies the admin user's password.
   * @param {ExpressRequest} req - The Express request object.
   * @param {InputVerifyPassword} body - The body containt password.
   * @returns {Promise<Option<OutputVerifyPassword>>} - A promise that resolves to either an authentication token.
   * @throws {NotFoundError} - If the admin/user is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
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
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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
      const res = await Singleton.getAuthInstance().verifyPassword(body, id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  /**
   * Logs out the admin/user.
   * @param {ExpressRequest} req - The Express request object.
   * @returns {Promise<Option<OutputLogout>>} - A promise that resolves to either an authentication token.
   * @throws {NotFoundError} - If the admin/user is not found.
   * @throws {InternalServerError} - If there is an internal server error.
   */
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
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
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
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async loginGoogle(
    @Body() payload: VerifyGoogleInput,
    @Request() req: ExpressRequest
  ): Promise<Option<OutputLoginUser>> {
    try {
      const res = await Singleton.getAuthInstance().verifyGoogle(
        payload.google_token_id
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
  @Response<any>('500', NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  })
  public async refreshTokenUser(
    @Request() req: ExpressRequest,
    @Body() body: InputRefreshToken
  ): Promise<Option<OutputRefreshToken>> {
    return await this.refreshTokenAdmin(req, body)
  }
}
