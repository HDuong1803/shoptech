import { Constant, logger } from '@constants'
import { UserDB } from '@schemas'
import mongoose from 'mongoose'
import web3 from 'web3'

const hashText = (text: string) => web3.utils.sha3(text) as string
/**
 * Initializes the admin user with the given initial username and password if it does not already exist.
 */
const initialAdmin = async () => {
  /**
   * Destructures the ADMIN_INITIAL_PASSWORD and ADMIN_INITIAL_EMAIL from the Constant object.
   * These values are environment variables that are used to set the initial username and password for the admin user.
   */
  const { ADMIN_INITIAL_PASSWORD, ADMIN_INITIAL_EMAIL, ADMIN_USERNAME } =
    Constant
  /**
   * Finds a user in the database with the given username.
   */
  const res = await UserDB.findOne({
    email: ADMIN_INITIAL_EMAIL
  })
  /**
   * Checks if an initial admin user exists in the database. If not, creates one using the
   * ADMIN_INITIAL_EMAIL and hash of ADMIN_INITIAL_PASSWORD environment variables.
   */
  if (!res) {
    if (Constant.ADMIN_INITIAL_PASSWORD) {
      await UserDB.create({
        username: ADMIN_USERNAME,
        email: ADMIN_INITIAL_EMAIL,
        password: hashText(ADMIN_INITIAL_PASSWORD),
        role: Constant.USER_ROLE.ADMIN,
        phone: Constant.ADMIN_PHONE_NUMBER,
        refresh_token: ''
      })
    }
  } else {
    logger.info(`initialAdmin already exist: ${ADMIN_INITIAL_EMAIL}`)
  }
}

/**
 * Initializes the database with the given initial database schema.
 */
const initialDatabase = async () => {
  await mongoose.connect(`${Constant.MONGODB_URL}`, {})
  logger.info('Connected to database')
}

export { hashText, initialAdmin, initialDatabase }
