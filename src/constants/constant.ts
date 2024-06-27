import 'dotenv/config'
import { ethers } from 'ethers'

export interface PayloadJwt {
  email?: string
  role?: number
  phone?: string
}

/**
 * An object containing constants for user roles.
 * @property {number} ADMIN - The value representing an admin user.
 * @property {number} USER - The value representing a regular user.
 */
const USER_ROLE = {
  ADMIN: 1,
  USER: 0
}

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
}

const OTP_TIMEOUT = 60000

/**
 * Generates a verification code for a user based on their username, hashed password, and a timestamp.
 * @param {string} username - The username of the user.
 * @param {string} hashed_password - The hashed password of the user.
 * @param {Date} timestamp - The timestamp to use for generating the verification code.
 * @returns {string} The verification code as a hashed value.
 */
const getVerifyCode = (
  username: string,
  hashed_password: string,
  timestamp: Date
) => {
  const secret_key = `${username}-${hashed_password}`
  const hashed_value = ethers.utils.hashMessage(
    `${timestamp.getTime()}${secret_key}`
  )
  return hashed_value
}

/**
 * An object containing various constants used throughout the application.
 */
const Constant = {
  JWT_EXPIRES_IN: '1d',
  JWT_REFRESH_EXPIRES_IN: '7d',
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  JWT_SECRET_REFRESH: `${process.env.JWT_SECRET_REFRESH}`,
  ADMIN_INITIAL_PASSWORD: `${process.env.ADMIN_INITIAL_PASSWORD}`,
  ADMIN_INITIAL_EMAIL: `${process.env.ADMIN_INITIAL_EMAIL}`,
  ADMIN_VERIFICATION_CODE: `${process.env.ADMIN_VERIFICATION_CODE}`,
  PORT: `${process.env.PORT}`,
  DATABASE_URL: `${process.env.DATABASE_URL}`,
  SECRET: `${process.env.SECRET}`,
  GOOGLE_ID: `${process.env.GOOGLE_ID}`,
  GOOGLE_SECRET: `${process.env.GOOGLE_SECRET}`,
  S3_SECRET_ACCESS_KEY: `${process.env.S3_SECRET_ACCESS_KEY}`,
  S3_ACCESS_KEY: `${process.env.S3_ACCESS_KEY}`,
  BUCKET_NAME: `${process.env.BUCKET_NAME}`,
  STRIPE_PK: `${process.env.STRIPE_PK}`,
  STRIPE_SK: `${process.env.STRIPE_SK}`,
  PUBLIC_URL: `${process.env.PUBLIC_URL}`,
  ENDPOINT_SECRET: `${process.env.ENDPOINT_SECRET}`,
  EMAIL_HOST: `${process.env.EMAIL_HOST}`,
  EMAIL_USERNAME: `${process.env.EMAIL_USERNAME}`,
  EMAIL_PASSWORD: `${process.env.EMAIL_PASSWORD}`,
  EMAIL_FROM: `${process.env.EMAIL_FROM}`,

  ADMIN_USERNAME: 'admin',
  ADMIN_PHONE_NUMBER: '0000000000',

  NETWORK_STATUS_CODE: {
    EMPTY: 204,
    SUCCESS: 200,
    BAD_REQUEST: 400,
    EXPIRE: 498,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_ENOUGH_RIGHT: 403,
    CONTENT_TOO_LARGE: 413,
    VALIDATE_ERROR: 422,
    LOGIN_BEFORE: 400,
    OTP_EXPIRED: 400,
    INVALID_VERIFY_CODE: 400,
    ADMIN_NOT_FOUND: 404
  },
  NETWORK_STATUS_MESSAGE: {
    EMPTY: 'Empty',
    SUCCESS: 'Success',
    BAD_REQUEST: 'Bad request',
    EXPIRE: 'Expire time',
    UNAUTHORIZED: 'Unauthorized',
    NOT_FOUND: 'Not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    NOT_ENOUGH_RIGHT: 'Not Enough Rights',
    CONTENT_TOO_LARGE: 'Content too large',
    VALIDATE_ERROR: 'Validate error',
    LOGIN_BEFORE: 'Please login before',
    OTP_EXPIRED: 'OTP expired',
    INVALID_VERIFY_CODE: 'Invalid verify code',
    ADMIN_NOT_FOUND: 'Admin not found',
    ALREADY_EXISTS: 'Already exists'
  },
  USER_ROLE,
  SHIPPING_PRICE: 0,
  PAYMENT_STATUS
}

export { Constant, getVerifyCode, OTP_TIMEOUT }
