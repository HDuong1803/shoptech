export interface IReview {
  user_id?: string | null
  rating?: number | null
  comment?: string | null
  product_id?: string | null
}
export interface IProduct {
  name: string | null
  image: string | null
  brand: string | null
  category: string | null
  description: string | null
  rating: number | null
  num_reviews: number | null
  price: number | null
  count_in_stock: number | null
}

export interface OutputSearchProduct {
  data: IProduct[]
}

export interface OutputListProduct {
  data: IProduct[]
  total?: number
}

export interface InputItem {
  name?: string
  image?: string
  brand?: string
  category?: string
  description?: string
  price?: number
  count_in_stock?: number
}

export interface InputReview {
  rating?: number
  comment?: string
}

export type OutputUpload = string[]
