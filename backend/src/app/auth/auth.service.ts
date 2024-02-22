import type {
  InputLoginAdmin,
  InputRefreshToken,
  InputVerifyPassword,
  OutputLogout,
  OutputRefreshToken,
  OutputVerifyPassword
} from '@app'
import { Constant, ErrorHandler } from '@constants'
import { hashText, renewJWT, signJWT } from '@providers'
import { TokenDB, UserDB } from '@schemas'
// import { OAuth2Client, type TokenPayload } from 'google-auth-library'

class AuthService {
  public async loginAdmin(body: InputLoginAdmin): Promise<any> {
    const isAdminExist = await UserDB.findOne({
        username: body.username,
        role: Constant.USER_ROLE.ADMIN
    })
    
    if (!isAdminExist) {
      throw new ErrorHandler(
        {
          username: {
            message: 'Username is not exist',
            value: body.username
          }
        },
        Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
      )
    }

    const hashed_password = hashText(body.password)
    const res = await UserDB.findOne({
        username: body.username,
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
        { username: body.username,
          role: Constant.USER_ROLE.ADMIN
        },
        { $set: { refresh_token: hashText(jwtPayload.refresh_token) } },
        { upsert: true }
      )
      await TokenDB.findOneAndUpdate(
        { user_id: res.id,
        },
        { $set: { token: hashText(jwtPayload.access_token) } },
        { upsert: true }
      )
      return {
        detail: res.toJSON(),
        ...jwtPayload,
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
      );
      return {
        access_token
      }
    } catch (error) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }
  }

  async verifyPassword(
    body: InputVerifyPassword,
    email: string
  ): Promise<OutputVerifyPassword> {
    const userRes = await UserDB.findOne({
      where: {
        email,
        password: hashText(body.password)
      }
    })
    return {
      authorized: !!userRes
    }
  }

  async logout(access_token: string): Promise<OutputLogout> {
    await TokenDB.deleteOne({ token: hashText(access_token) })
    return { logout: true }
  }

  //   async verifyGoogle(
  //     google_token_id: string,
  //     platform: string = 'android'
  //   ): Promise<OutputSubmitUser> {
  //     const clientId =
  //       platform === Constant.PLATFORM.IOS
  //         ? `${Constant.GOOGLE_CLIENT_ID_IOS}`
  //         : `${Constant.GOOGLE_CLIENT_ID_ANDROID}`
  //     const client = new OAuth2Client(clientId)
  //     const ticket = await client.verifyIdToken({
  //       idToken: google_token_id,
  //       audience: clientId
  //     })
  //     const payload = ticket.getPayload() as TokenPayload
  //     const { sub } = payload
  //     if (!sub) {
  //       throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  //     }
  //     /**
  //      * Finds a user in the database with the given username.
  //      * The object will have all attributes except for those specified in this.excludeAdminUserData.
  //      */
  //     const [res] = await UserDB.findOrCreate({
  //       where: {
  //         username: sub
  //       }
  //     })
  //     /**
  //      * Updates the last login time for a user and saves the changes to the database.
  //      */
  //     res.last_login_at = new Date()
  //     await res.save()
  //     /**
  //      * If the response object does not contain a mnemonic, generate a verification code
  //      * using the provided username, hashed password, and last login time.
  //      */
  //     /**
  //      * Generates a JSON Web Token (JWT) with the given user information and secret key.
  //      */
  //     const jwtPayload = signJWT({
  //       email: res.email,
  //       role: res.role,
  //       phone: res.phone
  //     })
  //     await token.findOrCreate({
  //       where: {
  //         user_id: res.id,
  //         token: hashText(jwtPayload.access_token)
  //       }
  //     })
  //     return {
  //       detail: res.toJSON(),
  //       ...jwtPayload,
  //     }
  //   }
}

export { AuthService }
