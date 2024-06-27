import type {
  InputLogin,
  InputRefreshToken,
  InputSignUp,
  InputVerifyPassword,
  OutputLogin,
  OutputLogout,
  OutputRefreshToken,
  OutputSignUp,
  OutputSubmitUser,
  OutputVerifyPassword
} from '@app'
import { Constant, ErrorHandler } from '@constants'
import { hashText, renewJWT, signJWT } from '@providers'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'
import { generateRandomVerificationCode, db } from '@utils'
// import { authenticator } from 'otplib'

class AuthService {
  public async userLogin(body: InputLogin): Promise<OutputLogin> {
    /**
     * Check if user exist in database, if not throw error invalid email
     */
    const isUserExist = await db.user.findFirst({
      where: {
        email: body.email
      }
    })
    if (!isUserExist) {
      throw new ErrorHandler(
        {
          email: {
            message: 'Email is not exist',
            value: body.email
          }
        },
        Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
      )
    }

    // const ENABLE_LOGIN_2FA = false

    // // 2FA is enbaled but token is not provided
    // if (
    //   ENABLE_LOGIN_2FA &&
    //   isUserExist.two_factor_auth &&
    //   (typeof body.token !== 'string' || body.token.trim()?.length !== 6)
    // ) {
    //   throw new Error('2FA token error')
    // }

    // // Validate 2FA token
    // if (
    //   ENABLE_LOGIN_2FA &&
    //   isUserExist.two_factor_auth &&
    //   typeof body.token === 'string' &&
    //   isUserExist.two_factor_secret
    // ) {
    //   if (
    //     !authenticator.verify({
    //       token: body.token,
    //       secret: isUserExist.two_factor_secret
    //     })
    //   ) {
    //     throw new Error('2FA token error')
    //   }
    // }

    /**
     * Hashes the given password using a secure one-way hashing algorithm.
     */
    const hashed_password = hashText(body.password)
    /**
     * Finds a user in the database with the given email and password.
     * The object will have all attributes except for those specified in this.excludeAdminUserData.
     */
    const res = await db.user.findFirstOrThrow({
      where: {
        email: body.email,
        password: hashed_password
      }
    })
    if (res) {
      res.last_login_at = new Date()
      await db.user.update({
        where: { id: res.id },
        data: { last_login_at: res.last_login_at }
      })

      /**
       * Generates a JSON Web Token (JWT) with the given user information and secret key.
       */
      const jwtPayload = signJWT({
        email: res.email,
        role: res.role as number,
        phone: res.phone as string
      })

      await db.user.upsert({
        where: {
          id: res.id
        },
        update: { refresh_token: hashText(jwtPayload.refresh_token) },
        create: { ...res, refresh_token: hashText(jwtPayload.refresh_token) }
      })

      await db.token.upsert({
        where: {
          user_id: res.id
        },
        update: { token: hashText(jwtPayload.access_token) },
        create: {
          token: hashText(jwtPayload.access_token),
          created_at: new Date(),
          user: { connect: { id: res.id } }
        }
      })

      return {
        detail: res,
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

  public async userSignUp(body: InputSignUp): Promise<OutputSignUp> {
    const isUserExist = await db.user.findFirst({
      where: { email: body.email }
    })
    if (isUserExist) {
      throw new ErrorHandler(
        {
          email: {
            message: 'Email already exists',
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
     * Generates a JSON Web Token (JWT) with the given user information and secret key.
     */
    const jwtPayload = signJWT({
      email: body.email,
      role: Constant.USER_ROLE.USER
    })

    /**
     * Create a new user in the database with the provided information.
     */
    let newUser
    try {
      newUser = await db.user.create({
        data: {
          username: body.username,
          email: body.email,
          verified: false,
          verification_code: generateRandomVerificationCode(6),
          avatar_url: null,
          phone: body.phone,
          password: hashed_password,
          two_factor_auth: false,
          two_factor_secret: null,
          role: Constant.USER_ROLE.USER,
          google_id: null,
          refresh_token: jwtPayload.refresh_token
        }
      })
    } catch (error) {
      throw new Error('Failed to signup')
    }

    await db.token.upsert({
      where: {
        user_id: newUser.id
      },
      update: { token: hashText(jwtPayload.access_token) },
      create: {
        token: hashText(jwtPayload.access_token),
        created_at: new Date(),
        user: { connect: { id: newUser.id } }
      }
    })

    await db.cart.create({
      data: {
        user: {
          connect: { id: newUser.id }
        }
      }
    })

    return {
      detail: newUser,
      ...jwtPayload
    }
  }

  /**
   * Refreshes the access token of a user or admin.
   * @param {InputRefreshToken} body - The refresh token of user or admin.
   * @returns {OutputRefreshToken} - A object.
   */
  async refreshToken(body: InputRefreshToken): Promise<OutputRefreshToken> {
    try {
      const { access_token, payload } = renewJWT(body.refresh_token)
      const userRes = await db.user.findFirstOrThrow({
        where: { email: payload.email }
      })
      if (!userRes) {
        throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
      }
      await db.token.upsert({
        where: { user_id: userRes.id },
        update: { token: hashText(access_token) },
        create: {
          token: hashText(access_token),
          created_at: new Date(),
          user: { connect: { id: userRes.id } }
        }
      })
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
   * @param {string} email - The email of user or admin.
   * @returns {Promise<OutputVerifyPassword>} - A promise that resolves to a object.
   * If the password is not correct, an error is thrown.
   * If the user or admin is not found, an error is thrown.
   */
  async verifyPassword(
    body: InputVerifyPassword,
    email: string
  ): Promise<OutputVerifyPassword> {
    const userRes = await db.user.findFirst({
      where: {
        email,
        password: hashText(body.password)
      }
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
    await db.token.delete({ where: { token: hashText(access_token) } })
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

    const res = await db.user.upsert({
      where: { email },
      update: { email, username: name, role: Constant.USER_ROLE.USER },
      create: {
        email,
        username: name,
        verified: false,
        verification_code: generateRandomVerificationCode(6),
        avatar_url: null,
        phone: null,
        password: null,
        two_factor_auth: false,
        two_factor_secret: null,
        role: Constant.USER_ROLE.USER,
        google_id: google_token_id,
        refresh_token: null
      }
    })
    /**
     * Updates the last login time for a user and saves the changes to the database.
     */
    res.last_login_at = new Date()
    await db.user.update({
      where: { id: res.id },
      data: { last_login_at: res.last_login_at }
    })
    /**
     * Generates a JSON Web Token (JWT) with the given user information and secret key.
     */
    const jwtPayload = signJWT({
      email: res.email,
      role: res.role as number,
      phone: res.phone as string
    })

    await db.user.upsert({
      where: {
        email,
        role: Constant.USER_ROLE.ADMIN
      },
      update: { refresh_token: hashText(jwtPayload.refresh_token) },
      create: { ...res, refresh_token: hashText(jwtPayload.refresh_token) }
    })

    await db.token.upsert({
      where: {
        user_id: res.id
      },
      update: { token: hashText(jwtPayload.access_token) },
      create: {
        token: hashText(jwtPayload.access_token),
        created_at: new Date(),
        user: { connect: { id: res.id } }
      }
    })
    return {
      detail: res,
      ...jwtPayload
    }
  }
}

export { AuthService }
