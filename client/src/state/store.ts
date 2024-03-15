import reducers from './reducers/index'
import { createAsyncThunk, configureStore } from '@reduxjs/toolkit'

const asyncAction = createAsyncThunk(
  'someAsyncAction',
  async (arg: any, thunkAPI) => {
    const data = await fetch(arg)
    return data
  }
)
const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware => getDefaultMiddleware()
})

export { store, asyncAction }
