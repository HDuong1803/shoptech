import mongoose, { type ConnectOptions } from 'mongoose'
import { Constant } from '@constants'

global.beforeAll(async () => {
  await mongoose.connect(`${Constant.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
})
