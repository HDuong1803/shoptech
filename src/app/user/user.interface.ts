export interface IUser {
  id?: number
  name?: string
  email?: string
  role?: number
  phone?: string
  create_at?: Date
  token?: string
}

export interface OutputListUser {
  data: IUser[]
  total?: number
}

export interface InputLogin {
  email: string
  password: string
}

export interface OutputLogin {
  detail: IUser | null
  access_token: string | null
  refresh_token: string | null
}

export interface InputSignUp {
  username: string
  email: string
  phone: string
  password: string
}

export interface OutputSignUp {
  detail: IUser | null
  access_token: string | null
  refresh_token: string | null
}
