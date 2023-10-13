import { IUser, InputLogin, InputSignUp, OutputListUser, OutputLogin, OutputSignUp, inputAccountValidate, validateUpdateUserName } from '@app'
import { ErrorHandler, type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
import { 
  AdminMiddleware, 
  AuthMiddleware 
} from '@middlewares'
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
  Put,
  BodyProp,
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('User')
@Route('user')
@Security({
  authorization: []
})
@Middlewares([AuthMiddleware])
export class UserController extends Controller {
  @Post('/signup')
  @Example<Option<OutputSignUp>>(
    {
      data: {
        detail: {
          name: 'Jay',
          email: 'janaka.e@gmail.com',
          role: 0,
          phone: '0987654321',
          update_at: new Date(),
          create_at: new Date(),
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmFrYS5lQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTY5MDc5NzA2OSwiZXhwIjoxNjkwODgzNDY5fQ.zCMep0NTK534az97PzYKxffbAJ3x4ad3YcRKjsoTnZM',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmFrYS5lQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTY5MDc5NzA2OSwiZXhwIjoxNjkxNDAxODY5fQ.QqSbNRNk12AvV6shP-TXtX0U2wDEyOYQC4xDxHCp3TQ',
        otp_code: null
      },
      success: true,
      message: 'Success',
      count: 1
    },
  )
  @Response<Option<OutputSignUp>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputSignUp>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputSignUp>>(
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
      /**
       * Validates the input login admin body and throws an error if it is invalid.
       */
      const validate = inputAccountValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      /**
       * Logs in the admin user using the provided credentials.
       */
      const res = await Singleton.getUserInstance().userSignUp(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }

  }

  @Post('/login')
  @Example<Option<OutputLogin>>(
    {
      data: {
        detail: {
          password: '$2b$10$siTQjwtbuLsX/L42OJt5gesDSqV52.ubiX4o9zEOeVkPobK5uwYcm'
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTA3OTc1NTMsImV4cCI6MTY5MDg4Mzk1M30.LkFDbrMba-8xNioG7b78iD8hvCyqAR4L5X8Dp1wb29c',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTA3OTc1NTMsImV4cCI6MTY5MTQwMjM1M30.YIS840Us75IPfeEm2x6poFz5tH42rNcTLemBo0CS4LY',
        otp_code: null
      },
      success: true,
      message: 'Success',
      count: 1
    }  
  )
  @Response<Option<OutputLogin>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputLogin>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputLogin>>(
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
      /**
       * Validates the input login admin body and throws an error if it is invalid.
       */
      const validate = inputAccountValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      /**
       * Logs in the admin user using the provided credentials.
       */
      const res = await Singleton.getUserInstance().userLogin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/profile')
  @Example<Option<IUser>>(
    {
      data: {
        _id: '64c87168d8767114beeb0f92',
        name: 'Jay',
        email: 'janaka.e@gmail.com',
        phone: '0987654321',
      },
      success: true,
      message: 'Success',
      count: 1
    },
    'User'
  )
  @Example<Option<IUser>>(
    {
      data: {
        username: 'administrator',
        name: 'admin',
      },
      message: 'Success',
      count: 1,
      success: true
    },
    'Admin'
  )
  @Response<Option<IUser>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IUser>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IUser>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async getUser(
    @Request() req: ExpressRequest,
  ): Promise<Option<IUser>> {
    try {
      const email = req.headers.email as string
      const result = await Singleton.getUserInstance().getUser(email)
      return onSuccess(result)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/list/profile')
  @Middlewares([AdminMiddleware])
  @Example<Option<OutputListUser>>(
    {
      data: [
        {
          name: 'John Doe',
          email: 'jdoe@gmail.com',
          role: 0,
          phone: '0987654321',
          createdAt: '2022-01-29T13:31:25.041Z'
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    },
    'User info'
  )
  @Response<Option<OutputListUser>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputListUser>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputListUser>>(
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
      const {data, total} = await Singleton.getUserInstance().getListUser(page, limit)
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/profile')
  @Example<Option<IUser>>(
    {
      data: {
        name: 'Jay',
        email: 'janaka.e@gmail.com',
        role: 0,
        phone: '0987654321',
        updatedAt: new Date()
      },
      success: true,
      message: 'Success',
      count: 1
    }
  )
  @Response<Option<IUser>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IUser>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IUser>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async updateUser(
    @Request() req: ExpressRequest,
    @BodyProp() name?: string,
  ): Promise<Option<IUser>> {
    try {
      const email = req.headers.email as string
      if (name) {
        const validate = validateUpdateUserName(name)
        if (validate) {
          throw new ErrorHandler(
            validate,
            Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
          )
        }
      }
      const result = await Singleton.getUserInstance().updateUser(email, name)
      return onSuccess(result)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}