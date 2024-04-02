import type { IUser, OutputListUser } from '@app'
import { Constant } from '@constants'
import { UserDB } from '@schemas'

class UserService {
  /**
   * Retrieves a user by ID.
   * @param {string} user_id - The ID of the user to retrieve.
   * @returns {Promise<IUser>} - A promise that resolves to the user object if found.
   * If the user is not found, an error is thrown.
   */
  public async getUser(user_id: string): Promise<IUser> {
    const user = await UserDB.findById(user_id)
    if (user) {
      return await user.toJSON()
    }
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }

  /**
   * Retrieves a list of users with pagination.
   * @param {number} page - The page number.
   * @param {number} limit - The maximum number of users per page.
   * @returns {Promise<OutputListUser>} - A promise that resolves to the list of users and total count.
   */
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

  /**
   * Updates user information.
   * @param {string} user_id - The ID of the user to update.
   * @param {string} name - The new name to update.
   * @param {string} password - The new password to update.
   * @param {string} phone - The new phone number to update.
   * @returns {Promise<IUser>} - A promise that resolves to the updated user object.
   */
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
