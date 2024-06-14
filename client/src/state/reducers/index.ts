import { combineReducers } from 'redux'
import { getCartReducer, paymentReducer } from './cartReducer'
import {
  createOrderReducer,
  getOrderReducer,
  orderPayReducer,
  getOrdersReducer,
  orderDeliverReducer,
  getMyOrdersReducer
} from './orderReducers'
import {
  addReviewReducer,
  createProductReducer,
  getProductReducer,
  getProductsReducer,
  getTopProductsReducer,
  quickSearchReducer
} from './productReducer'
import {
  loginReducer,
  registerReducer,
  getUserReducer,
  updateProfileReducer,
  updateUserReducer,
  getUsersReducer
} from './userReducer'

const reducers = combineReducers({
  cart: getCartReducer,
  payment: paymentReducer,
  products: getProductsReducer,
  product: getProductReducer,
  review: addReviewReducer,
  userRegister: registerReducer,
  userLogin: loginReducer,
  order: getOrderReducer,
  orderCreate: createOrderReducer,
  orderPay: orderPayReducer,
  user: getUserReducer,
  users: getUsersReducer,
  orders: getOrdersReducer,
  orderDeliver: orderDeliverReducer,
  createProduct: createProductReducer,
  topProducts: getTopProductsReducer,
  quickSearch: quickSearchReducer,
  myOrders: getMyOrdersReducer,
  profileUpdate: updateProfileReducer,
  userUpdate: updateUserReducer
})

export default reducers

export type State = ReturnType<typeof reducers>
