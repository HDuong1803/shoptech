import { Constant, logger } from '@constants'
import { UserDB } from '@schemas';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

/**
  * Hashes the given password using the SHA3 algorithm provided by the web3 library.
  * @param {string} password - The password to be hashed.
  * @returns {string} - The hashed password.
  */
const hashPassword = (password: string): string => bcrypt.hashSync(password, Constant.HASH_ROUNDS) as string;

/**
 * Initializes the admin user with the given initial username and password if it does not already exist.
 */
const initialAdmin = async () => {
  /**
   * Finds a user in the database with the given username.
   */
  const res = await UserDB.findOne({
      email: Constant.ADMIN_INITIAL_USERNAME
  })  

  /**
   * Checks if an initial admin user exists in the database. If not, creates one using the
   * ADMIN_INITIAL_USERNAME and hash of ADMIN_INITIAL_PASSWORD environment variables.
   */
  if (!res) {
    if (Constant.ADMIN_INITIAL_PASSWORD) {
      await UserDB.create({
        name: Constant.ADMIN_NAME,
        email: Constant.ADMIN_INITIAL_USERNAME,
        password: hashPassword(Constant.ADMIN_INITIAL_PASSWORD),
        role: Constant.USER_ROLE.ADMIN,
        phone: Constant.ADMIN_PHONE_NUMBER,
        refresh_token: ""
      })
    }
  } else {
    logger.info(
      `initialAdmin already exist: ${Constant.ADMIN_INITIAL_USERNAME}`
    )
  }
}

/**
 * Initializes the database with the given initial database schema.
 */
const initialDatabase = async () => {
  await mongoose.connect(`${Constant.MONGO_URI}`, {});
  logger.info("Connected to database");
}

export { hashPassword, initialAdmin, initialDatabase }
