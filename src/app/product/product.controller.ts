import {
  type IProduct,
  type IReview,
  InputItem,
  InputReview,
  type OutputListProduct,
  type OutputSearchProduct,
  type OutputUpload,
  inputItemValidate,
  inputReviewValidate
} from '@app'
import { Constant, ErrorHandler, type Option } from '@constants'
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
  Example,
  Response,
  Delete,
  Put,
  UploadedFile
} from 'tsoa'

const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Product')
@Route('product')
@Security({
  authorization: []
})
export class ProductController extends Controller {
  @Get('/list/item')
  @Example<any>(
    {
      data: [
        {
          _id: '61f65428e1273b6867abb86c',
          name: 'Microsoft Surface Laptop 13.5 inch',
          image:
            'https://hd-ecommerce.s3.amazonaws.com/0x712da98e5f152b205eb19884d87bf56206de3b24407c6f5f0c72fafbecefabf6',
          brand: 'Microsoft',
          category: 'Laptops',
          description:
            'Intel® Core™ i5-1135G7 Processor, Free Upgrade to Windows 11, RAM: 8 GB / Storage: 512 GB SSD, Graphics: Intel® Iris® Xe, Quad HD touchscreen, Two Thunderbolt / USB 4 ports',
          rating: 4.666666666666667,
          numReviews: 3,
          price: 1599.99,
          countInStock: 100,
          reviews: [
            {
              _id: '61f9294b52258858000c650c',
              name: 'Adithya',
              rating: 5,
              comment: 'Light weight and easy to use.',
              created_at: '2024-01-01T12:36:27.249Z',
              updated_at: '2024-01-01T12:36:27.249Z'
            },
            {
              _id: '61f929b352258858000c6539',
              name: 'Steve',
              rating: 5,
              comment: 'Great laptop',
              created_at: '2024-01-01T12:38:11.234Z',
              updated_at: '2024-01-01T12:38:11.234Z'
            },
            {
              _id: '61f92a1b75e5339fc3836059',
              name: 'Jay',
              rating: 4,
              comment: 'Good but not excellent',
              created_at: '2024-01-01T12:39:55.347Z',
              updated_at: '2024-01-01T12:39:55.347Z'
            }
          ],
          created_at: '2024-01-30T09:02:32.052Z',
          updated_at: '2024-01-01T12:39:55.347Z',
          __v: 3
        },
        {
          _id: '61fa9d3c54d0d0a51edccdea',
          name: 'DELL KM117 WIRELESS KEYBOARD AND MOUSE',
          image:
            'https://hd-ecommerce.s3.amazonaws.com/0x1397b404c2144baae788ef2e5adf1fcac43c302c77c790f6f39c938b49f00648',
          brand: 'Dell',
          category: 'Accessories',
          description:
            'Rechargeable lithium ion battery, Standard Keyboard and mouse',
          rating: 0,
          numReviews: 0,
          price: 199.99,
          countInStock: 100,
          reviews: [],
          created_at: '2024-01-02T15:03:24.114Z',
          updated_at: '2024-01-02T15:03:24.114Z',
          __v: 0
        }
      ],
      success: true,
      message: 'Success',
      count: 2,
      total: 24
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
  @Example<any>(
    {
      data: {
        _id: '61fa9d3c54d0d0a51edccdea',
        name: 'DELL KM117 WIRELESS KEYBOARD AND MOUSE',
        image:
          'https://hd-ecommerce.s3.amazonaws.com/0x1397b404c2144baae788ef2e5adf1fcac43c302c77c790f6f39c938b49f00648',
        brand: 'Dell',
        category: 'Accessories',
        description:
          'Rechargeable lithium ion battery, Standard Keyboard and mouse',
        rating: 0,
        numReviews: 0,
        price: 199.99,
        countInStock: 100,
        reviews: [],
        created_at: '2024-01-02T15:03:24.114Z',
        updated_at: '2024-01-02T15:03:24.114Z',
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
  @Example<any>(
    {
      data: {
        _id: '61fa9d3c54d0d0a51edccdea',
        name: 'DELL KM117 WIRELESS KEYBOARD AND MOUSE',
        image:
          'https://hd-ecommerce.s3.amazonaws.com/0x1397b404c2144baae788ef2e5adf1fcac43c302c77c790f6f39c938b49f00648',
        brand: 'Dell',
        category: 'Accessories',
        description:
          'Rechargeable lithium ion battery, Standard Keyboard and mouse',
        rating: 0,
        numReviews: 0,
        price: 199.99,
        countInStock: 100,
        reviews: [],
        created_at: '2024-01-02T15:03:24.114Z',
        updated_at: '2024-01-02T15:03:24.114Z',
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

  @Post('/upload')
  @Example<any>(
    {
      data: '0xad6c1b10d79a8fd21b547cb74e4239d2f5e79105f2f1d6289306e988e5bf2c6a',
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
  public async uploadImages(
    @Request() req: ExpressRequest,
    @UploadedFile()
    image: Express.Multer.File
  ): Promise<Option<OutputUpload>> {
    try {
      const res = await Singleton.getProductInstance().uploadImages(
        image.buffer
      )
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Post('/item/review')
  @Example<any>(
    {
      data: {
        user_id: '65defc93ce29856a1d3d3687',
        username: 'Hai Duong',
        rating: 5,
        comment: 'Good'
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
  @Middlewares([AuthMiddleware])
  public async addProductReview(
    @Request() req: ExpressRequest,
    @Body() body: InputReview,
    @Query() product_id: string
  ): Promise<Option<IReview>> {
    try {
      /**
       * Validates the input review body and throws an error if it is invalid.
       */
      const validate = inputReviewValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const user_id = req.headers.id as string
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

  @Middlewares([AdminMiddleware])
  @Post('/add')
  @Example<any>(
    {
      data: {
        _id: '61fa9d3c54d0d0a51edccdea',
        name: 'DELL KM117 WIRELESS KEYBOARD AND MOUSE',
        image:
          'https://hd-ecommerce.s3.amazonaws.com/0x1397b404c2144baae788ef2e5adf1fcac43c302c77c790f6f39c938b49f00648',
        brand: 'Dell',
        category: 'Accessories',
        description:
          'Rechargeable lithium ion battery, Standard Keyboard and mouse',
        rating: 0,
        numReviews: 0,
        price: 199.99,
        countInStock: 100,
        reviews: [],
        created_at: '2024-01-02T15:03:24.114Z',
        updated_at: '2024-01-02T15:03:24.114Z',
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
  public async addProductItem(
    @Request() req: ExpressRequest,
    @Body() body: InputItem
  ): Promise<Option<IProduct>> {
    try {
      /**
       * Validates the input item body and throws an error if it is invalid.
       */
      const validate = inputItemValidate(body)
      if (validate) {
        throw new ErrorHandler(
          validate,
          Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
        )
      }
      const res = await Singleton.getProductInstance().addProductItem(body)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Put('/update')
  @Example<any>(
    {
      data: {
        _id: '61fa9d3c54d0d0a51edccdea',
        name: 'DELL KM117 WIRELESS KEYBOARD AND MOUSE',
        image:
          'https://hd-ecommerce.s3.amazonaws.com/0x1397b404c2144baae788ef2e5adf1fcac43c302c77c790f6f39c938b49f00648',
        brand: 'Dell',
        category: 'Accessories',
        description:
          'Rechargeable lithium ion battery, Standard Keyboard and mouse',
        rating: 0,
        numReviews: 0,
        price: 199.99,
        countInStock: 100,
        reviews: [],
        created_at: '2023-07-02T15:03:24.114Z',
        updated_at: '2023-07-02T15:03:24.114Z',
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
  @Example<any>(
    {
      data: 'Success',
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
}
