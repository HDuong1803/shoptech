import type { Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
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
  Tags
} from 'tsoa'
@Tags('Admin')
@Route('admin')
@Middlewares([AuthMiddleware, AdminMiddleware])
@Security({
  authorization: []
})
export class AdminController extends Controller {
  @Get('info')
  public async infoAdmin(
    @Request() req: ExpressRequest
  ): Promise<Option<any>> {
    try {

      const res = await Singleton.getAdminInstance().infoAdmin()
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
