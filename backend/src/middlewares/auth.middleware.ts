import { UserDB } from "@schemas";
import { type NextFunction, type Request, type Response } from 'express'
import { Constant, logError, onError } from "@constants";
import { verifyJWT } from "@providers";

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant

/**
 * Middleware function that checks if the request has a valid authorization header and
 * verifies the signature of the request.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    /**
     * Verifies the authorization token using the JWT_SECRET environment variable and extracts the address from the token.
     */
    const payload = verifyJWT(authorization)

    if (!payload.email) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    next()
  } catch (error: any) {
    return res
      .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
      .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
  }
}

/**
 * Middleware function that checks if the user making the request is an admin.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const AdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email }  = req.headers

    if (!email) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    /**
     * Finds a user in the database with the given address and role of "admin".
     */
    const userRes = await UserDB.findOne({
        role: Constant.USER_ROLE.ADMIN
    })
    /**
     * Checks if the user response exists. If it does not exist, returns an error response
     * with a status code of 401 (Unauthorized).
     */
    if (!userRes) {
      return res
        .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
        .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
    }
    next()
  } catch (error: any) {
    logError(error, req, '[AdminMiddleware]')
    return res
      .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
      .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED))
  }
}

export { AuthMiddleware, AdminMiddleware };
