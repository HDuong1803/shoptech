export interface PayloadJwt {
  email?: string
  role?: Number
  phone?: string
}

/**
 * An object containing constants for user roles.
 * @property {number} ADMIN - The value representing an admin user.
 * @property {number} USER - The value representing a regular user.
 */
const USER_ROLE = {
  ADMIN: 1,
  USER: 0,
};

/**
 * An object containing various constants used throughout the application.
 */
const Constant = {
  JWT_EXPIRES_IN: "1d",
  JWT_REFRESH_EXPIRES_IN: "7d",
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  JWT_SECRET_REFRESH: `${process.env.JWT_SECRET_REFRESH}`,
  ADMIN_INITIAL_PASSWORD: `${process.env.ADMIN_INITIAL_PASSWORD}`,
  ADMIN_INITIAL_USERNAME: `${process.env.ADMIN_INITIAL_USERNAME}`,
  ADMIN_NAME: "admin",
  ADMIN_PHONE_NUMBER: "0000000000",
  PORT: `${process.env.PORT}`,
  MONGO_URI: `${process.env.MONGO_URI}`,
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
    ADMIN_NOT_FOUND: 404,
  },
  NETWORK_STATUS_MESSAGE: {
    EMPTY: "Empty",
    SUCCESS: "Success",
    BAD_REQUEST: "Bad request",
    EXPIRE: "Expire time",
    UNAUTHORIZED: "Unauthorized",
    NOT_FOUND: "Not found",
    INTERNAL_SERVER_ERROR: "Internal server error",
    NOT_ENOUGH_RIGHT: "Not Enough Rights",
    CONTENT_TOO_LARGE: "Content too large",
    VALIDATE_ERROR: "Validate error",
    LOGIN_BEFORE: "Please login before",
    OTP_EXPIRED: "OTP expired",
    INVALID_VERIFY_CODE: "Invalid verify code",
    ADMIN_NOT_FOUND: "Admin not found",
  },
  USER_ROLE,
  HASH_ROUNDS: 10,
  SHIPPING_PRICE: 0
};

export { Constant };
