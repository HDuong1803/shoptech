import type { IUser, OutputLogin } from '@app'

/**
 * Interface for the input fields of the admin login form.
 * @interface InputLoginAdmin
 * @property {string} email - The email entered in the login form.
 * @property {string} password - The password entered in the login form.
 */
export interface InputLoginAdmin {
  email: string
  password: string
}

/**
 * Interface for the input object when refreshing an access token.
 * @interface InputRefreshToken
 * @property {string} refresh_token - The refresh token used to obtain a new access token.
 */
export interface InputRefreshToken {
  refresh_token: string
}

/**
 * Interface for the input object when verify password.
 * @interface InputVerifyPassword
 * @property {string} password - The password of user or admin.
 */
export interface InputVerifyPassword {
  password: string
}

/**
 * Interface for the output of the login admin function.
 * @interface OutputLoginAdmin
 * @property {IUser | null} [detail] - The user details.
 * @property {string | null} [access_token] - The access token for the user.
 * @property {string | null} [refresh_token] - The refresh token for the user.
 */
export interface OutputLoginAdmin {
  detail: IUser | null
  access_token: string | null
  refresh_token: string | null
}

/**
 * Defines the type for the output of the submit admin function, which is the same as the output of the login admin function.
 * @typedef {OutputLoginAdmin} OutputSubmitAdmin
 */
export type OutputSubmitAdmin = OutputLoginAdmin
export type OutputLoginUser = OutputLogin
export type OutputSubmitUser = OutputLogin

/**
 * Interface for the output of a refresh token request.
 * @interface OutputRefreshToken
 * @property {string} access_token - The new access token.
 */
export interface OutputRefreshToken {
  access_token: string
}

/**
 * Interface for the output of verify password.
 * @interface OutputVerifyPassword
 * @property {boolean} authorized - Is account authorized.
 */
export interface OutputVerifyPassword {
  authorized: boolean
}

/**
 * Interface for the output of verify password.
 * @interface VerifyGoogleInput
 * @property {string} google_token_id - Is account authorized.
 */
export interface VerifyGoogleInput {
  google_token_id: string
}

/**
 * Interface for the output of logout.
 * @interface OutputLogout
 * @property {boolean} logout - Is account logouted.
 */
export interface OutputLogout {
  logout: boolean
}
