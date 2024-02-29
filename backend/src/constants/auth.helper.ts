import { hashText } from "@providers"
import { TokenDB, UserDB } from "@schemas"

const authUser = async (authorization: string) => {
    const token = await TokenDB.findOne({token: hashText(authorization as string)})
    if (!token) {
      throw new Error('Please login!')
    }
    const user = await UserDB.findById(token.user_id)
    return user
}

export { authUser }