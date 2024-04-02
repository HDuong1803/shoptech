import { Constant, type PayloadJwt } from '@constants'
import jwt from 'jsonwebtoken'

const verifyJWT = (token: string): PayloadJwt => {
  return jwt.verify(token, Constant.JWT_SECRET) as PayloadJwt
}

const renewJWT = (
  refresh_token: string
): {
  access_token: string
  payload: PayloadJwt
} => {
  const payload = jwt.verify(
    refresh_token,
    Constant.JWT_SECRET_REFRESH
  ) as PayloadJwt
  return {
    access_token: signJWT({
      email: payload.email,
      role: payload.role,
      phone: payload.phone
    }).access_token,
    payload
  }
}

const signJWT = (payload: PayloadJwt) => {
  return {
    access_token: jwt.sign(payload, Constant.JWT_SECRET, {
      expiresIn: Constant.JWT_EXPIRES_IN
    }),
    refresh_token: jwt.sign(payload, Constant.JWT_SECRET_REFRESH, {
      expiresIn: Constant.JWT_REFRESH_EXPIRES_IN
    })
  }
}

export { verifyJWT, signJWT, renewJWT }
