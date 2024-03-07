import { Constant, logger } from '@constants'
import { UserDB } from '@schemas'
import mongoose from 'mongoose'
import web3 from 'web3'

const hashText = (text: string) => web3.utils.sha3(text) as string

const initialAdmin = async () => {
  const res = await UserDB.findOne({
    email: Constant.ADMIN_INITIAL_USERNAME
  })

  if (!res) {
    if (Constant.ADMIN_INITIAL_PASSWORD) {
      await UserDB.create({
        username: Constant.ADMIN_NAME,
        email: Constant.ADMIN_INITIAL_USERNAME,
        password: hashText(Constant.ADMIN_INITIAL_PASSWORD),
        role: Constant.USER_ROLE.ADMIN,
        phone: Constant.ADMIN_PHONE_NUMBER,
        refresh_token: ''
      })
    }
  } else {
    logger.info(
      `initialAdmin already exist: ${Constant.ADMIN_INITIAL_USERNAME}`
    )
  }
}

const initialDatabase = async () => {
  await mongoose.connect(`${Constant.MONGODB_URL}`, {})
  logger.info('Connected to database')
}

export { hashText, initialAdmin, initialDatabase }
