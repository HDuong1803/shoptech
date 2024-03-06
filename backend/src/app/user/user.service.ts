import {
  InputLogin,
  OutputLogin,
  type IUser,
  type OutputListUser,
  InputSignUp,
  OutputSignUp
} from '@app'
import { Constant, ErrorHandler } from '@constants'
import { hashText, signJWT } from '@providers'
import { CartDB, TokenDB, UserDB } from '@schemas'

class UserService {
  public async userLogin(body: InputLogin): Promise<OutputLogin> {
    /**
     * Check if admin exist in database, if not throw error invalid email
     */
    const isUserExist = await UserDB.findOne(
      { role: Constant.USER_ROLE.USER },
      { email: body.email }
    )
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

    /**
     * Hashes the given password using a secure one-way hashing algorithm.
     */
    const hashed_password = hashText(body.password)
    /**
     * Finds a user in the database with the given email and password.
     * The object will have all attributes except for those specified in this.excludeAdminUserData.
     */
    const res = await UserDB.findOne(
      { email: body.email },
      { password: hashed_password }
    )
    if (res) {
      /**
       * Generates a JSON Web Token (JWT) with the given user information and secret key.
       */
      const jwtPayload = signJWT({
        email: res.email,
        role: res.role
      })

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
    const isUserExist = await UserDB.findOne({ email: body.email })
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
      role: Constant.USER_ROLE.USER,
    })

    /**
     * Create a new user in the database with the provided information.
     */
    let newUser;
    try {
        newUser = await UserDB.create({
          username: body.username,
          email: body.email,
          phone: body.phone,
          password: hashed_password,
          role: Constant.USER_ROLE.USER,
          refresh_token: jwtPayload.refresh_token
        })
    } catch (error) {
        throw new Error('Failed to signup');
    }

    await TokenDB.findOneAndUpdate(
      {
        user_id: newUser._id
      },
      { $set: { token: hashText(jwtPayload.access_token) } },
      { upsert: true }
    )

    await CartDB.create({
      user_id: newUser._id,
      cart: []
    })

    return {
      detail: newUser.toJSON(),
      ...jwtPayload
    }
  }

  public async getUser(user_id: string): Promise<IUser> {
    const user = await UserDB.findById(user_id)
    if (user) {
      return user.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async getListUser(
    page: number,
    limit: number
  ): Promise<OutputListUser> {
    const offset = (page - 1) * limit

    const users = await UserDB.find().skip(offset).limit(limit).exec()

    const totalUsers = await UserDB.countDocuments()

    return {
      data: users,
      total: totalUsers
    }
  }

  public async updateUser(
    user_id?: string,
    name?: string,
    password?: string,
    phone?: string
  ): Promise<IUser> {
    if (!user_id) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    const res = await UserDB.findById(user_id)
    if (!res) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    if (name) {
      res.username = name
    }
    if (password) {
      res.password = password
    }
    if (phone) {
      res.phone = phone
    }
    await res.save()
    return res
  }
}

export { UserService }
