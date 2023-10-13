// import { addOrderItems, UserService } from '@app'

import { InputLogin, OutputLogin, type IUser, type OutputListUser, InputSignUp, OutputSignUp } from "@app"
import { Constant, ErrorHandler } from "@constants"
import { signJWT } from "@providers"
import { UserDB } from "@schemas"
import bcrypt from 'bcrypt'

class UserService {
  public async userLogin(body: InputLogin): Promise<OutputLogin> {
    /**
     * Check if admin exist in database, if not throw error invalid email
     */
    const isUserExist = await UserDB.findOne(
      {role: Constant.USER_ROLE.USER},
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
    const hashed_password = bcrypt.hashSync(body.password, Constant.HASH_ROUNDS)
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
        role: res.role,
      })
      await UserDB.findOneAndUpdate(
        { email: res.email },
        { token: bcrypt.hashSync(jwtPayload.access_token, Constant.HASH_ROUNDS) }
      )
      return {
        detail: res.toJSON(),
        ...jwtPayload,
        otp_code: null
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
    /**
     * Check if the user already exists in the database, if so throw an error indicating duplicate email.
     */
    const isUserExist = await UserDB.findOne({ email: body.email})
    if (isUserExist) {
      throw new ErrorHandler(
        {
          email: {
            message: 'Email already exists',
            value: body.email,
          },
        },
        Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED
      )
    }

    /**
     * Hashes the given password using a secure one-way hashing algorithm.
     */
    const hashed_password = bcrypt.hashSync(body.password, Constant.HASH_ROUNDS)

    /**
     * Generates a JSON Web Token (JWT) with the given user information and secret key.
     */
    const jwtPayload = signJWT({
      email: body.email,
      role: Constant.USER_ROLE.USER,
      phone: body.phone
    })

    /**
     * Create a new user in the database with the provided information.
     */
    const newUser = new UserDB({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: hashed_password,
      role: Constant.USER_ROLE.USER,
      refresh_token: jwtPayload.refresh_token,
    })
    await newUser.save()

    return {
      detail: newUser.toJSON(),
      ...jwtPayload,
      otp_code: null,
    }
  }

  public async getUser(email: string): Promise<IUser> {
    const res = await UserDB.findOne(
      { email },
      { _id: 1, name: 1, email: 1, phone: 1 }
    )
    if (res) {
      return res.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  public async getListUser(page: number, limit: number): Promise<OutputListUser> {
    const offset = (page - 1) * limit

    const filter = { role: Constant.USER_ROLE.USER }
    const projection = { _id: 1, name: 1, email: 1, phone:1, role: 1, createdAt: 1, updatedAt: 1 }

    const users = await UserDB.find(filter, projection)
      .skip(offset)
      .limit(limit)
      .exec()

    const totalUsers = await UserDB.countDocuments(filter)

    return {
      data: users,
      total: totalUsers
    }
  }

  public async updateUser(
    email?: string,
    newName?: string,
  ): Promise<IUser> {
    if (!email) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    const res = await UserDB.findOne(
      { email },
      { _id: 1, name: 1, email: 1, phone:1, role: 1, updatedAt: 1}
    )
    if (!res) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
    }
    if (newName) {
      res.name = newName
    }
    await res.save()
    return res
  }
}

export { UserService }