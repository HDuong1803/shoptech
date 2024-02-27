export interface IReview {
  name?: string
  rating?: number
  comment?: string
}
export interface IProduct {
  name?: string
  image?: string
  brand?: string
  category?: string
  description?: string
  rating?: number
  numReviews?: number
  price?: number
  countInStock?: number
  reviews?: IReview[]
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
  countInStock?: number
}

export interface InputReview {
  rating?: number
  comment?: string
}

export type OutputUpload = string[]

