import type { userAttributes } from '@schemas'

export interface InputLoginAdmin {
  username: string
  password: string
}

export interface InputRefreshToken {
  refresh_token: string
}

export interface InputVerifyPassword {
  password: string
}

export interface InputSubmitMnemonicAdmin {
  signature_payload: string
  verify_code: string
}

export interface InputSubmitMnemonicUser {
  signature_payload: string
  verify_code: string
  token_id: string
  social_type: string
  password: string
}

export interface OutputLoginAdmin {
  detail: userAttributes | null
  access_token: string | null
  refresh_token: string | null
}

export type OutputSubmitAdmin = OutputLoginAdmin
export type OutputLoginUser = OutputLoginAdmin
export type OutputSubmitUser = OutputLoginAdmin

export interface OutputRefreshToken {
  access_token: string
}

export interface OutputVerifyPassword {
  authorized: boolean
}

export interface VerifyGoogleInput {
  google_token_id: string
}

export interface OutputLogout {
  logout: boolean
}
