import mongoose, { type ConnectOptions } from 'mongoose'
import { Constant } from '@constants'

global.beforeAll(async () => {
  // const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = Constant

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  await mongoose.connect(`${Constant.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
})
