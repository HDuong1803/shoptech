import {
  IProduct,
  IReview,
  InputItem,
  InputReview,
  OutputListProduct,
  OutputSearchProduct,
  OutputUpload
} from '@app'
import { type Option } from '@constants'
import { logError, onError, onSuccess } from '@constants'
import {
  AdminMiddleware,
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
  Delete,
  Put,
  UploadedFile
} from 'tsoa'

@Tags('Product')
@Route('product')
@Security({
  authorization: []
})
export class ProductController extends Controller {

  @Post('/add')
  @Middlewares([AdminMiddleware])
  public async addProductItem(
    @Request() req: ExpressRequest,
    @Body() body: InputItem
  ): Promise<Option<IProduct>> {
    try {
      const res = await Singleton.getProductInstance().addProductItem(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/upload')
  @Middlewares([AdminMiddleware])
  public async uploadImages(
    @Request() req: ExpressRequest,
    @UploadedFile()
    image: Express.Multer.File
  ): Promise<Option<OutputUpload>> {
    try {
      const res = await Singleton.getProductInstance().uploadImages(image.buffer)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/update')
  @Middlewares([AdminMiddleware])
  public async updateItem(
    @Request() req: ExpressRequest,
    @Body() body: InputItem,
    @Query() id?: string
  ): Promise<Option<IProduct>> {
    try {
      const res = await Singleton.getProductInstance().updateItem(body, id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Delete('/remove')
  @Middlewares([AdminMiddleware])
  public async RemoveItem(
    @Request() req: ExpressRequest,
    @Query() id?: string
  ): Promise<Option<any>> {
    try {
      const res = await Singleton.getProductInstance().removeItem(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/list/item')
  public async getListProduct(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 5
  ): Promise<Option<OutputListProduct>> {
    try {
      const { data, total } =
        await Singleton.getProductInstance().getListProduct(page, limit)
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/detail')
  public async getProductById(
    @Request() req: ExpressRequest,
    @Query() id?: string
  ): Promise<Option<any>> {
    try {
      const res = await Singleton.getProductInstance().getProductById(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/search')
  public async searchProductItem(
    @Request() req: ExpressRequest,
    @Query() keyword: string = req.query.keyword as string
  ): Promise<Option<OutputSearchProduct>> {
    try {
      const { data } = await Singleton.getProductInstance().searchProductItem(
        keyword
      )
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Middlewares([AuthMiddleware])
  @Post('/item/review')
  public async addProductReview(
    @Request() req: ExpressRequest,
    @Body() body: InputReview,
    @Query() product_id: string
  ): Promise<Option<IReview>> {
    try {
      const { user_id } = req.params
      const res = await Singleton.getProductInstance().addProductReview(
        body,
        product_id,
        user_id
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }
}
