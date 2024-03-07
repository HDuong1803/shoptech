import { Constant } from '@constants'
import { UserDB } from '@schemas'
class AdminService {
  public async infoAdmin(): Promise<any> {
    const res = await UserDB.findOne({
        role: Constant.USER_ROLE.ADMIN
    })
    if (res) return res.toJSON()
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.ADMIN_NOT_FOUND)
  }
}

export { AdminService }
