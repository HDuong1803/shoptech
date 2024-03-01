import { ActionType } from "../action-types";
import { Action } from "../actions/index";

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems") || "{}")
  : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress") || "{}")
  : [];

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod") || "{}")
  : [];

const getCartReducer = (
  state = {
    cartItem: [],
    error: null,
    loading: false,
  },
  action: Action
) => {
  switch (action.type) {
    case ActionType.GET_CART_REQUEST:
      return { ...state, loading: true, error: null };
    case ActionType.GET_CART_SUCCESS:
      return {
        ...state,
        cartItem: action.payload,
        loading: false,
        error: null,
      };
    case ActionType.GET_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const cartReducer = (
  state = {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  action: Action
) => {
  switch (action.type) {
    case ActionType.CART_UPDATE_ITEM:
      const item = action.payload;

      let existItem = state.cartItems.find(
        (x: any) => x.product === item.product
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x: any) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case ActionType.CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x: any) => x.product !== action.payload
        ),
      };
    case ActionType.CART_SAVE_SHIPPING_ITEM:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case ActionType.CART_SAVE_PAYMENT_ITEM:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case ActionType.CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

export { cartReducer, getCartReducer };
