import { Constant, logger } from '@constants'
import { db } from '@utils'
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
  const {
    ADMIN_INITIAL_PASSWORD,
    ADMIN_INITIAL_EMAIL,
    ADMIN_USERNAME,
    ADMIN_VERIFICATION_CODE
  } = Constant
  /**
   * Finds a user in the database with the given username.
   */
  console.log(hashText('123456aA@'))
  const res = await db.user.findFirst({
    where: {
      email: ADMIN_INITIAL_EMAIL
    }
  })
  /**
   * Checks if an initial admin user exists in the database. If not, creates one using the
   * ADMIN_INITIAL_EMAIL and hash of ADMIN_INITIAL_PASSWORD environment variables.
   */
  if (!res) {
    if (Constant.ADMIN_INITIAL_PASSWORD) {
      await db.user.create({
        data: {
          username: ADMIN_USERNAME,
          email: ADMIN_INITIAL_EMAIL,
          password: hashText(ADMIN_INITIAL_PASSWORD),
          verified: true,
          verification_code: ADMIN_VERIFICATION_CODE,
          role: Constant.USER_ROLE.ADMIN,
          phone: Constant.ADMIN_PHONE_NUMBER,
          refresh_token: ''
        }
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
  try {
    await db.$connect()
    logger.info('Connected to database')
  } catch (error) {
    logger.error('Error connecting to database', error)
  }
}

export { hashText, initialAdmin, initialDatabase }
