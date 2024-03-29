import type { IUser, OutputListUser } from '@app'
import { Constant } from '@constants'
import { UserDB } from '@schemas'

class UserService {
  public async getUser(user_id: string): Promise<IUser> {
    const user = await UserDB.findById(user_id)
    if (user) {
      return await user.toJSON()
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
