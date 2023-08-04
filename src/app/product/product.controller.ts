import { IProduct, IReview, InputItem, InputReview, OutputListProduct, OutputSearchProduct } from '@app'
import { type Option } from '@constants'
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
  Delete,
  Put,
} from 'tsoa'
const { NETWORK_STATUS_MESSAGE } = Constant

@Tags('Product')
@Route('product')
@Security({
  authorization: []
})
export class ProductController extends Controller {
  @Get('/list/item')
  @Example<Option<OutputListProduct>>(
    {
      data: [
        {
          _id: '61f55a5762a68fe81c96d895',
          name: 'Apple MacBook Pro 13.3 inch',
          image: '/images/macbook.jpeg',
          brand: 'Apple',
          category: 'Laptops',
          description: 'Apple M1 chip with 8-core CPU, 8-core GPU, 16-core Neural Engine, 8GB unified memory, 256GB SSD storage, 13-inch Retina display with True Tone, Magic Keyboard, Touch Bar and Touch ID, Force Touch trackpad, Two Thunderbolt / USB 4 ports',
          rating: 4,
          numReviews: 5,
          price: 1299.99,
          countInStock: 100,
          reviews: [
            {
              _id: '61f6d08fa8bdd68c3b1e063a',
              name: 'John Doe',
              rating: 4,
              comment: 'This one is a good one.',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    }
  )
  @Response<Option<OutputListProduct>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputListProduct>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputListProduct>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async getListProduct(
    @Request() req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 5
  ): Promise<Option<OutputListProduct>> {
    try {
      const { data, total } = await Singleton.getProductInstance().getListProduct(
        page,
        limit
      )
      return onSuccess(data, total)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/detail')
  @Example<Option<OutputListProduct>>(
    {
      data: [
        {
          _id: '61f55a5762a68fe81c96d895',
          name: 'Apple MacBook Pro 13.3 inch',
          image: '/images/macbook.jpeg',
          brand: 'Apple',
          category: 'Laptops',
          description: 'Apple M1 chip with 8-core CPU, 8-core GPU, 16-core Neural Engine, 8GB unified memory, 256GB SSD storage, 13-inch Retina display with True Tone, Magic Keyboard, Touch Bar and Touch ID, Force Touch trackpad, Two Thunderbolt / USB 4 ports',
          rating: 4,
          numReviews: 5,
          price: 1299.99,
          countInStock: 100,
          reviews: [
            {
              _id: '61f6d08fa8bdd68c3b1e063a',
              name: 'John Doe',
              rating: 4,
              comment: 'This one is a good one.',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
      total: 1
    }
  )
  @Response<Option<OutputListProduct>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputListProduct>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputListProduct>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async getProductById(
    @Request() req: ExpressRequest,
    @Query() id?: string
  ): Promise<Option<OutputListProduct>> {
    try {
      const res = await Singleton.getProductInstance().getProductById(id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Get('/search')
  @Example<Option<OutputSearchProduct>>(
    {
      data: [
        {
          _id: '61f55a5762a68fe81c96d895',
          name: 'Apple MacBook Pro 13.3 inch',
          image: '/images/macbook.jpeg',
          brand: 'Apple',
          category: 'Laptops',
          description: 'Apple M1 chip with 8-core CPU, 8-core GPU, 16-core Neural Engine, 8GB unified memory, 256GB SSD storage, 13-inch Retina display with True Tone, Magic Keyboard, Touch Bar and Touch ID, Force Touch trackpad, Two Thunderbolt / USB 4 ports',
          rating: 4,
          numReviews: 5,
          price: 1299.99,
          countInStock: 100,
          reviews: [
            {
              _id: '61f6d08fa8bdd68c3b1e063a',
              name: 'John Doe',
              rating: 4,
              comment: 'This one is a good one.',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
    }
  )
  @Response<Option<OutputSearchProduct>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<OutputSearchProduct>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<OutputSearchProduct>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async searchProductItem(
    @Request() req: ExpressRequest,
    @Query() keyword: string = req.query.keyword as string
  ): Promise<Option<OutputSearchProduct>> {
    try {
      const { data } = await Singleton.getProductInstance().searchProductItem(keyword)
      return onSuccess(data)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  @Middlewares([AuthMiddleware])
  @Post('/item/review')
  @Example<Option<IProduct>>(
    {
      data: {
        user_id: '64c87021dd08b118fc16339f',
        name: 'John Doe',
        rating: 5,
        comment: 'good'
      },
      success: true,
      message: 'Success',
      count: 1
    }
  )
  @Response<Option<IProduct>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IProduct>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IProduct>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async addProductReview(
    @Request() req: ExpressRequest,
    @Body() body: InputReview,
  ): Promise<Option<IReview>> {
    try {
      const { product_id, user_id } = req.body
      const res = await Singleton.getProductInstance().addProductReview(body, product_id, user_id)
      return onSuccess(res)
    } catch (error: any) {
      logError(error, req)
      return onError(error, this)
    }
  }

  
  @Post('/add')
  @Middlewares([AdminMiddleware])
  @Example<Option<IProduct>>(
    {
      data: {
        name: 'Apple MacBook Pro 13.3 inch',
        image: '/images/macbook.jpeg',
        brand: 'Apple',
        category: 'Laptops',
        description: 'Apple M1 chip with 8-core CPU, 8-core GPU, 16-core Neural Engine, 8GB unified memory, 256GB SSD storage, 13-inch Retina display with True Tone, Magic Keyboard, Touch Bar and Touch ID, Force Touch trackpad, Two Thunderbolt / USB 4 ports',
        rating: 0,
        numReviews: 0,
        price: 1299.99,
        countInStock: 100,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      },
      success: true,
      message: 'Success',
      count: 1
    }
  )
  @Response<Option<IProduct>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IProduct>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IProduct>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
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

  
  @Put('/update')
  @Middlewares([AdminMiddleware])
  @Example<Option<IProduct>>(
    {
      data: [
        {
          _id: '61f55a5762a68fe81c96d895',
          name: 'Apple MacBook Pro 13.3 inch',
          image: '/images/macbook.jpeg',
          brand: 'Apple',
          category: 'Laptops',
          description: 'Apple M1 chip with 8-core CPU, 8-core GPU, 16-core Neural Engine, 8GB unified memory, 256GB SSD storage, 13-inch Retina display with True Tone, Magic Keyboard, Touch Bar and Touch ID, Force Touch trackpad, Two Thunderbolt / USB 4 ports',
          rating: 4,
          numReviews: 5,
          price: 1299.99,
          countInStock: 100,
          reviews: [
            {
              _id: '61f6d08fa8bdd68c3b1e063a',
              name: 'John Doe',
              rating: 4,
              comment: 'This one is a good one.',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      ],
      success: true,
      message: 'Success',
      count: 1,
    }
  )
  @Response<Option<IProduct>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<IProduct>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<IProduct>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
  public async UpdateItem(
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
  @Example<Option<any>>(
    {
      data: 'Success',
      success: true,
      message: 'Success',
      count: 1,
    }
  )
  @Response<Option<any>>('401', NETWORK_STATUS_MESSAGE.UNAUTHORIZED, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.UNAUTHORIZED
  })
  @Response<Option<any>>('404', NETWORK_STATUS_MESSAGE.NOT_FOUND, {
    success: false,
    message: NETWORK_STATUS_MESSAGE.NOT_FOUND
  })
  @Response<Option<any>>(
    '500',
    NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    {
      success: false,
      message: NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
    }
  )
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