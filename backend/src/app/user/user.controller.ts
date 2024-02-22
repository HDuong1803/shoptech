import {
  IUser,
  InputLogin,
  InputSignUp,
  OutputListUser,
  OutputLogin,
  OutputSignUp,
  inputAccountValidate,
  validateUpdateUserName
} from '@app'
import { ErrorHandler, type Option } from '@constants'
import { Constant, logError, onError, onSuccess } from '@constants'
// import { AdminMiddleware, AuthMiddleware } from '@middlewares'
import { Singleton } from '@providers'
import { Request as ExpressRequest } from 'express'
import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  // Middlewares,
  Request,
  Route,
  // Security,
  Tags,
  Put,
  BodyProp
} from 'tsoa'
// const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('User')
@Route('user')
// @Security({
//   authorization: []
// })
// @Middlewares([AuthMiddleware])
export class UserController extends Controller {
  @Post('/signup')
  public async userSignUp(
    @Request() req: ExpressRequest,
    @Body() body: InputSignUp
  ): Promise<Option<OutputSignUp>> {
    try {

      const validate = inputAccountValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const res = await Singleton.getUserInstance().userSignUp(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/login')
  public async userLogin(
    @Request() req: ExpressRequest,
    @Body() body: InputLogin
  ): Promise<Option<OutputLogin>> {
    try {
      const validate = inputAccountValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const res = await Singleton.getUserInstance().userLogin(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/profile')
  public async getUser(@Request() req: ExpressRequest): Promise<Option<IUser>> {
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
  // @Middlewares([AdminMiddleware])
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
  public async updateUser(
    @Request() req: ExpressRequest,
    @BodyProp() body?: any
  ): Promise<Option<IUser>> {
    try {
      const email = req.headers.email as string
      if (body.newName) {
        const validate = validateUpdateUserName(body.newName)
        if (validate) {
          throw new ErrorHandler(
            validate,
            Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
          )
        }
      }
      const result = await Singleton.getUserInstance().updateUser(
        email,
        body.newName,
        body.newEmail,
        body.newPassword
      )
      return onSuccess(result)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
