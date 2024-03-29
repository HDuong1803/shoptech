import type {
  InputLoginAdmin,
  InputRefreshToken,
  InputVerifyPassword,
  OutputLogout,
  OutputRefreshToken,
  OutputSubmitUser,
  OutputVerifyPassword
} from '@app'
import { Constant, ErrorHandler } from '@constants'
import { hashText, renewJWT, signJWT } from '@providers'
import { TokenDB, UserDB } from '@schemas'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'

class AuthService {
  public async loginAdmin(body: InputLoginAdmin): Promise<any> {
    /**
     * Check if admin exist in database, if not throw error invalid email
     */
    const isAdminExist = await UserDB.findOne({
      email: body.email,
      role: Constant.USER_ROLE.ADMIN
    })

    if (!isAdminExist) {
      throw new ErrorHandler(
        {
          email: {
            message: 'email is not exist',
            value: body.email
          }
        },
        Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
      )
    }
    /**
     * Hashes the given password using a secure one-way hashing algorithm.
     */
    const hashed_password = hashText(body.password)
    /**
     * Finds a user in the database with the given email and password.
     */
    const res = await UserDB.findOne({
      email: body.email,
      password: hashed_password
    })
    if (res) {
      res.last_login_at = new Date()
      await res.save()
      const jwtPayload = signJWT({
        email: res.email,
        role: res.role,
        phone: res.phone
      })
      await UserDB.findOneAndUpdate(
        { email: body.email, role: Constant.USER_ROLE.ADMIN },
        { $set: { refresh_token: hashText(jwtPayload.refresh_token) } },
        { upsert: true }
      )
      await TokenDB.findOneAndUpdate(
        { user_id: res.id },
        { $set: { token: hashText(jwtPayload.access_token) } },
        { upsert: true }
      )
      return {
        detail: res.toJSON(),
        ...jwtPayload
      }
    }
    throw new ErrorHandler(
      {
        password: {
          message: 'Password is incorrect',
          value: body.password
        }
      },
      Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
    )
  }

  /**
   * Refreshes the access token of a user or admin.
   * @param {InputRefreshToken} body - The refresh token of user or admin.
   * @returns {OutputRefreshToken} - A object.
   */
  async refreshToken(body: InputRefreshToken): Promise<OutputRefreshToken> {
    try {
      const { access_token, payload } = renewJWT(body.refresh_token)
      const userRes = await UserDB.findOne({
        email: payload.email
      })
      if (!userRes) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
      }
      await TokenDB.findOneAndUpdate(
        { user_id: userRes.id },
        { token: hashText(access_token) },
        { upsert: true, new: true }
      )
      return {
        access_token
      }
    } catch (error) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }
  }

  /**
   * Verifies the password of a user or admin.
   * @param {InputVerifyPassword} body - The password of user or admin.
   * @param {string} address - The address of user or admin.
   * @returns {Promise<OutputVerifyPassword>} - A promise that resolves to a object.
   * If the password is not correct, an error is thrown.
   * If the user or admin is not found, an error is thrown.
   */
  async verifyPassword(
    body: InputVerifyPassword,
    id: string
  ): Promise<OutputVerifyPassword> {
    const userRes = await UserDB.findOne({
      _id: id,
      password: hashText(body.password)
    })
    return {
      authorized: !!userRes
    }
  }

  /**
   * Logs out a user or admin.
   * @param {string} access_token - The access token of user or admin.
   * @returns {Promise<OutputLogout>} - A promise that resolves to a object.
   */
  async logout(access_token: string): Promise<OutputLogout> {
    await TokenDB.deleteOne({ token: hashText(access_token) })
    return { logout: true }
  }

  /**
   * Verifies google token id.
   * @param {string} google_token_id - The google token id of user or admin.
   * @returns {Promise<OutputSubmitUser>} - A promise that resolves to a object.
   */
  async verifyGoogle(google_token_id: string): Promise<OutputSubmitUser> {
    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({
      idToken: google_token_id
    })
    const payload = ticket.getPayload() as TokenPayload
    const { email, name } = payload
    if (!email) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }

    const res = await UserDB.findOneAndUpdate(
      { email },
      { $set: { email, username: name, role: Constant.USER_ROLE.USER } },
      { upsert: true, new: true }
    )
    /**
     * Updates the last login time for a user and saves the changes to the database.
     */
    res.last_login_at = new Date()
    await res.save()
    /**
     * Generates a JSON Web Token (JWT) with the given user information and secret key.
     */
    const jwtPayload = signJWT({
      email: res.email,
      role: res.role,
      phone: res.phone
    })
    await UserDB.findOneAndUpdate(
      { email, role: Constant.USER_ROLE.USER },
      { $set: { refresh_token: hashText(jwtPayload.refresh_token) } },
      { upsert: true }
    )
    await TokenDB.findOneAndUpdate(
      {
        user_id: res.id
      },
      { $set: { token: hashText(jwtPayload.access_token) } },
      { upsert: true }
    )
    return {
      detail: res.toJSON(),
      ...jwtPayload
    }
  }
}

export { AuthService }
