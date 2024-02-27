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
  Tags
} from 'tsoa'

@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {

  @Post('admin/login')
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
  @Security({
    authorization: []
  })
  @Middlewares([AuthMiddleware])
  public async verifyPassword(
    @Request() req: ExpressRequest,
    @Body() body: InputVerifyPassword
  ): Promise<Option<OutputVerifyPassword>> {
    try {
      const address = req.headers.address as string
      const res = await Singleton.getAuthInstance().verifyPassword(
        body,
        address
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('logout')
  @Middlewares([AuthMiddleware])
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
  public async refreshTokenUser(
    @Request() req: ExpressRequest,
    @Body() body: InputRefreshToken
  ): Promise<Option<OutputRefreshToken>> {
    return await this.refreshTokenAdmin(req, body)
  }
}
