import { ActionType } from '../action-types'
import { Action } from '../actions/index'

const shippingAddressFromStorage = localStorage.getItem('shipping_address')
  ? JSON.parse(localStorage.getItem('shipping_address') || '{}')
  : []

const payment_methodFromStorage = localStorage.getItem('payment_method')
  ? JSON.parse(localStorage.getItem('payment_method') || '{}')
  : []

const getCartReducer = (
  state = {
    cartItem: [],
    error: null,
    loading: false
  },
  action: Action
) => {
  switch (action.type) {
    case ActionType.GET_CART_REQUEST:
      return { ...state, loading: true, error: null }
    case ActionType.GET_CART_SUCCESS:
      return {
        ...state,
        cartItem: action.payload,
        loading: false,
        error: null
      }
    case ActionType.GET_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const paymentReducer = (
  state = {
    shipping_address: shippingAddressFromStorage,
    payment_method: payment_methodFromStorage
  },
  action: Action
) => {
  switch (action.type) {
    case ActionType.CART_SAVE_SHIPPING_ITEM:
      return {
        ...state,
        shipping_address: action.payload
      }
    case ActionType.CART_SAVE_PAYMENT_ITEM:
      return {
        ...state,
        payment_method: action.payload
      }
    default:
      return state
  }
}

export { paymentReducer, getCartReducer }
