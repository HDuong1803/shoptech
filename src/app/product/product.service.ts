import type {
  IReview,
  IProduct,
  InputItem,
  InputReview,
  OutputListProduct,
  OutputSearchProduct,
  OutputUpload
} from '@app'
import { Constant } from '@constants'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import mime from 'mime-types'
import { keccak256 } from 'ethers/lib/utils'
import { db } from '@utils'
class ProductService {
  /**
   * Add a new product item to the database.
   * @param {InputItem} body - The product details to be added.
   * @returns {Promise<IProduct>} - A promise that resolves to the newly created product.
   */
  public async addProductItem(body: InputItem): Promise<IProduct> {
    const new_item = await db.product.create({
      data: {
        name: body.name ?? '',
        image: body.image ?? '',
        brand: body.brand ?? '',
        category: body.category ?? '',
        description: body.description ?? '',
        rating: 0,
        num_reviews: 0,
        price: body.price ?? 0,
        count_in_stock: body.count_in_stock ?? 0
      }
    })
    return new_item
  }

  /**
   * Uploads images to an S3 bucket.
   * @param {Buffer} imageBuffer - The image data as a buffer.
   * @returns {Promise<OutputUpload>} - A promise that resolves to the uploaded image links.
   */
  public async uploadImages(imageBuffer: Buffer): Promise<OutputUpload> {
    const client = new S3Client({
      region: 'ap-southeast-2',
      credentials: {
        accessKeyId: `${process.env.S3_ACCESS_KEY}`,
        secretAccessKey: `${process.env.S3_SECRET_ACCESS_KEY}`
      }
    })
    const links: string[] = []
    const fileName = keccak256(imageBuffer)

    await client.send(
      new PutObjectCommand({
        Bucket: Constant.BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ACL: 'public-read',
        ContentType: mime.lookup(fileName) || undefined
      })
    )

    const link = `https://${Constant.BUCKET_NAME}.s3.amazonaws.com/${fileName}`
    links.push(link)

    return links
  }

  /**
   * Removes a product item from the database.
   * @param {string} id - The ID of the product item to remove.
   * @returns {Promise<any>} - A promise that resolves with a success message upon deletion.
   */
  public async removeItem(id?: string): Promise<any> {
    const item = await db.product.delete({ where: { id } })
    if (item) {
      return Constant.NETWORK_STATUS_MESSAGE.SUCCESS
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Updates an existing product item in the database.
   * @param {InputItem} body - The updated product details.
   * @param {string} id - The ID of the product item to update.
   * @returns {Promise<IProduct>} - A promise that resolves to the updated product.
   */
  public async updateItem(body: InputItem, id?: string): Promise<IProduct> {
    const existing_product = await db.product.findUnique({ where: { id } })

    if (existing_product) {
      const updated_item = await db.product.update({
        where: { id },
        data: {
          ...existing_product,
          name: body.name,
          price: body.price,
          description: body.description,
          image: body.image,
          brand: body.brand,
          category: body.category,
          count_in_stock: body.count_in_stock
        }
      })

      return updated_item as IProduct
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Retrieves a list of products with pagination.
   * @param {number} page - The page number.
   * @param {number} limit - The maximum number of products per page.
   * @returns {Promise<OutputListProduct>} - A promise that resolves to the list of products and total count.
   */
  public async getListProduct(
    page: number,
    limit: number
  ): Promise<OutputListProduct> {
    const offset = (page - 1) * limit

    const items = await db.product.findMany({
      orderBy: [{ rating: 'desc' }, { num_reviews: 'desc' }],
      skip: offset,
      take: limit,
      include: {
        reviews: true
      }
    })

    const total_items = await db.product.count()

    return { data: items, total: total_items }
  }

  /**
   * Retrieves a product by its ID.
   * @param {string} id - The ID of the product to retrieve.
   * @returns {Promise<IProduct>} - A promise that resolves to the product object if found.
   * If the product is not found, an error is thrown.
   */
  public async getProductById(id?: string): Promise<IProduct> {
    const item = await db.product.findUnique({ where: { id } })
    if (item) {
      return item
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Searches for product items based on a keyword.
   * @param {string} keyword - The keyword to search for in product names.
   * @returns {Promise<OutputSearchProduct>} - A promise that resolves to the search results.
   */
  public async searchProductItem(
    keyword?: string
  ): Promise<OutputSearchProduct> {
    const items = await db.product.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive'
        }
      }
    })

    if (items.length > 0) {
      return {
        data: items
      }
    } else {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
  }

  /**
   * Adds a review for a product.
   * @param {InputReview} body - The review details.
   * @param {string} product_id - The ID of the product being reviewed.
   * @param {string} user_id - The ID of the user posting the review.
   * @returns {Promise<IReview>} - A promise that resolves to the added review.
   */
  public async addProductReview(
    body: InputReview,
    product_id?: string,
    user_id?: string
  ): Promise<IReview> {
    const product = await db.product.findUnique({ where: { id: product_id } })
    const user = await db.user.findUnique({ where: { id: user_id } })

    if (!product) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    if (!user) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }

    const existing_review = await db.review.findFirst({
      where: { AND: [{ user_id }, { product_id }] }
    })

    if (existing_review) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.ALREADY_EXISTS)
    }

    const new_review = await db.review.create({
      data: {
        rating: body.rating,
        comment: body.comment,
        user_id: user.id,
        product_id: product.id
      }
    })

    const product_reviews = await db.review.findMany({
      where: { product_id: product.id }
    })

    const total_rating = product_reviews.reduce(
      (acc, review) => (review.rating !== null ? acc + review.rating : acc),
      0
    )
    const avg_rating =
      product_reviews.length > 0 ? total_rating / product_reviews.length : 0

    await db.product.update({
      where: { id: product.id },
      data: {
        rating: avg_rating,
        num_reviews: product_reviews.length
      }
    })

    return new_review
  }
}

export { ProductService }
