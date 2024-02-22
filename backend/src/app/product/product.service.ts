import {
  IReview,
  IProduct,
  InputItem,
  InputReview,
  OutputListProduct,
  OutputSearchProduct
} from '@app'
import { Constant } from '@constants'
import { ProductDB, UserDB, reviewAttributes } from '@schemas'

class ProductService {
  public async getListProduct(
    page: number,
    limit: number
  ): Promise<OutputListProduct> {
    const offset = (page - 1) * limit

    const items = await ProductDB.find()
      .skip(offset)
      .limit(limit)
      .sort({ rating: -1 })

    const totalItem = await ProductDB.countDocuments()

    return {
      data: items,
      total: totalItem
    }
  }

  public async addProductItem(body: InputItem): Promise<IProduct> {
    const newItem = new ProductDB({
      name: body.name,
      image: body.image,
      brand: body.brand,
      category: body.category,
      description: body.description,
      price: body.price,
      countInStock: body.countInStock
    })
    await newItem.save()
    return newItem.toJSON()
  }

  public async getProductById(_id?: string): Promise<IProduct> {
    const item = await ProductDB.findById({ _id })
    if (item) {
      return item.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async searchProductItem(
    keyword?: string
  ): Promise<OutputSearchProduct> {
    const item = await ProductDB.find({
      name: {
        $regex: keyword,
        $options: 'i'
      }
    })
    if (item) {
      return {
        data: item
      }
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async addProductReview(
    body: InputReview,
    product_id?: string,
    user_id?: string
  ): Promise<IReview> {
    const product = await ProductDB.findById(product_id)
    const user = await UserDB.findById(user_id)
    if (product) {
      const review = {
        user_id: user?._id,
        username: user?.username,
        rating: Number(body.rating),
        comment: body.comment
      }
      product.reviews = product.reviews ?? ([] as unknown as [reviewAttributes])
      product.reviews.push(review)
      product.numReviews = product.reviews.length
      if (product.reviews && product.reviews.length > 0) {
        const totalRating = product.reviews.reduce(
          (acc: number, item: any) => item.rating + acc,
          0
        )
        product.rating = totalRating / product.reviews.length
      } else {
        product.rating = 0
      }
      await product.save()
      return review
    } else {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
  }

  public async removeItem(_id?: string): Promise<any> {
    const item = await ProductDB.findByIdAndDelete({ _id })
    if (item) {
      return Constant.NETWORK_STATUS_MESSAGE.SUCCESS
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async updateItem(body: InputItem, _id?: string): Promise<IProduct> {
    const item = await ProductDB.findById({ _id })
    if (item) {
      item.name = body.name
      item.price = body.price
      item.description = body.description
      item.image = body.image
      item.brand = body.brand
      item.category = body.category
      item.countInStock = body.countInStock
      const updateItem = await item.save()
      return updateItem.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }
}

export { ProductService }
