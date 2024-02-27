import {
  IUser,
  InputLogin,
  InputSignUp,
  OutputListUser,
  OutputLogin,
  OutputSignUp,
} from '@app'
import { type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import { AdminMiddleware, AuthMiddleware } from '@middlewares'
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
  Put,
  BodyProp
} from 'tsoa'
// 

@Tags('User')
@Route('user')
export class UserController extends Controller {
  @Post('/signup')
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
  @Middlewares([AdminMiddleware])
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
    @BodyProp() name: string,
    @BodyProp() password: string,
    @BodyProp() phone: string
  ): Promise<Option<IUser>> {
    try {
      const email = req.body.email as string
      const result = await Singleton.getUserInstance().updateUser(
        email,
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
