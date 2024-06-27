import type { InputUpdateUser, IUser, OutputListUser } from '@app'
import { Constant } from '@constants'
import { db } from '@utils'

class UserService {
  /**
   * Retrieves a user by ID.
   * @param {string} user_id - The ID of the user to retrieve.
   * @returns {Promise<IUser>} - A promise that resolves to the user object if found.
   * If the user is not found, an error is thrown.
   */
  public async getUser(user_id: string): Promise<IUser> {
    const user = await db.user.findUnique({ where: { id: user_id } })
    if (user) {
      return user
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

    const users = await db.user.findMany({
      skip: offset,
      take: limit
    })

    const totalUsers = await db.user.count()

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
    body?: InputUpdateUser
  ): Promise<IUser> {
    const user = await db.user.findUnique({ where: { id: user_id } })

    if (!user) {
      throw new Error(Constant.NETWORK_STATUS_MESSAGE.UNAUTHORIZED)
    }

    const updatedUser = await db.user.update({
      where: { id: user_id },
      data: {
        username: body?.username ?? user.username,
        password: body?.password ?? user.password,
        phone: body?.phone ?? user.phone,
        avatar_url: body?.avatar_url ?? user.avatar_url
      }
    })

    return updatedUser
  }
}

export { UserService }
