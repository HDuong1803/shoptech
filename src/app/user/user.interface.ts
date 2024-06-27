export interface IUser {
  id?: string
  username?: string | null
  email?: string
  verified?: boolean | null
  password?: string | null
  verification_code?: string | null
  avatar_url?: string | null
  role?: number | null
  phone?: string | null
  two_factor_auth?: boolean | null
  two_factor_secret: string | null
  refresh_token?: string | null
  google_id?: string | null
  last_login_at?: Date | null
  created_at?: Date | null
  updated_at?: Date | null
}

export interface InputUpdateUser {
  username?: string | null
  password?: string | null
  phone?: string | null
  avatar_url?: string | null
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
