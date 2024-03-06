import axios from "axios";
import { Dispatch } from "redux";
import { ActionType } from "../action-types";
import { Action } from "../actions/index";
import { store } from "../store";
import { SERVER } from "../../constants/constant";

export const addToCart = (
  product_id: string,
  name: string,
  quantity: number,
  image: string,
  price: number
) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    const token = `${localStorage.getItem("access_token")}`;
    const formData = {
      product_id,
      name,
      quantity,
      image,
      price,
    };
    const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        id: user_id
      },
    };
    const { data } = await axios.post(
      `${SERVER.baseURL}/cart/add?product_id=${product_id}`,
      formData,
      config
    );

    dispatch({
      type: ActionType.CART_ADD_ITEM,
      payload: {
        product: data.data._id,
        name: data.data.name,
        quantity: data.data.quantity,
        image: data.data.image,
        price: data.data.price,
      },
    });
  };
};

export const getCart = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_CART_REQUEST,
      });
      const token = `${localStorage.getItem("access_token")}`;
      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };
      const { data } = await axios.get(`${SERVER.baseURL}/cart`, config);
      dispatch({
        type: ActionType.GET_CART_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_CART_FAIL,
        payload: error.response.data.message,
      });
    }
  };
};

export const updateCart = (product_id: string, action: string) => {
  return async (dispatch: Dispatch<Action>) => {
    const token = `${localStorage.getItem("access_token")}`;
    const formData = {
      action,
    };
    
    const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };
    const { data } = await axios.put(
      `${SERVER.baseURL}/cart/quantity?product_id=${product_id}`,
      formData,
      config
    );
    dispatch({
      type: ActionType.CART_UPDATE_ITEM,
      payload: data.data,
    });
  };
};

export const removeFromCart = (product_id: string) => {
  return async (dispatch: Dispatch<Action>) => {
    const token = `${localStorage.getItem("access_token")}`;
    const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };
    const { data } = await axios.delete(
      `${SERVER.baseURL}/cart/item?product_id=${product_id}`,
      config
    );
    dispatch({
      type: ActionType.CART_REMOVE_ITEM,
      payload: data.data,
    });
  };
};

export const saveShippingAddress = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CART_SAVE_SHIPPING_ITEM,
      payload: data,
    });

    localStorage.setItem("shipping_address", JSON.stringify(data));
  };
};

export const savePaymentMethod = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CART_SAVE_PAYMENT_ITEM,
      payload: data,
    });

    localStorage.setItem("payment_method", JSON.stringify(data));
  };
};

export const getProducts = (page: number) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_PRODUCTS_REQUEST,
      });

      const { data } = await axios.get(
        `${SERVER.baseURL}/product/list/item?page=${page}&limit=8`
      );

      dispatch({
        type: ActionType.GET_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };
};

export const quickSearchProducts = (keyword?: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.QUICK_SEARCH_REQUEST,
      });

      const { data } = await axios.get(
        `${SERVER.baseURL}/product/search?keyword=${keyword}`
      );
      dispatch({
        type: ActionType.QUICK_SEARCH_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.QUICK_SEARCH_FAIL,
        payload: error,
      });
    }
  };
};

export const getProduct = (id: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_PRODUCT_REQUEST,
      });

      const { data } = await axios.get(
        `${SERVER.baseURL}/product/detail?id=${id}`
      );

      dispatch({
        type: ActionType.GET_PRODUCT_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_PRODUCT_FAIL,
        payload: error,
      });
    }
  };
};

export const addReview = (id: string, rating: number, comment: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.ADD_REVIEW_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const { data } = await axios.post(
        `${SERVER.baseURL}/product/item/review?product_id=${id}`,
        { rating, comment },
        config
      );

      dispatch({
        type: ActionType.ADD_REVIEW_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.ADD_REVIEW_FAIL,
        payload: error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };
};

export const register = (
  username: string,
  email: string,
  phone: string,
  password: string
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.USER_REGISTER_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = {
        username,
        email,
        phone,
        password,
      };

      const { data } = await axios.post(
        `${SERVER.baseURL}/user/signup`,
        formData,
        config
      );

      dispatch({
        type: ActionType.USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionType.USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error: any) {
      dispatch({
        type: ActionType.USER_REGISTER_FAIL,
        payload: error,
      });
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.USER_LOGIN_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = {
        email,
        password,
      };

      const { data } = await axios.post(
        `${SERVER.baseURL}/user/login`,
        formData,
        config
      );

      dispatch({
        type: ActionType.USER_LOGIN_SUCCESS,
        payload: data.data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("access_token", data.data.access_token);
    } catch (error: any) {
      dispatch({
        type: ActionType.USER_LOGIN_FAIL,
        payload: error,
      });
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<Action>) => {
    const config = {
      headers: {
        Authorization: `${localStorage.getItem("access_token")}`,
        accept: "application/json",
      },
    };

    const { data } = await axios.post(
      `${SERVER.baseURL}/auth/logout`,
      null,
      config
    );
    localStorage.removeItem("userInfo");
    dispatch({ type: ActionType.USER_LOGOUT, payload: data });
  };
};

export const createOrder = (shipping_address: any, payment_method: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.CREATE_ORDER_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;
      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const formData = {
        shipping_address,
        payment_method,
      };

      const { data } = await axios.post(
        `${SERVER.baseURL}/order/add`,
        formData,
        config
      );

      dispatch({
        type: ActionType.CREATE_ORDER_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.CREATE_ORDER_FAIL,
        payload: error,
      });
    }
  };
};

export const getOrder = (id: any) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    try {
      dispatch({
        type: ActionType.GET_ORDER_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;
      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const { data } = await axios.get(`${SERVER.baseURL}/order/${id}`, config);
      dispatch({
        type: ActionType.GET_ORDER_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_ORDER_FAIL,
        payload: error,
      });
    }
  };
};

export const payOrder = (order_id: any) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    try {
      dispatch({
        type: ActionType.ORDER_PAY_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };
      const { data } = await axios.post(
        `${SERVER.baseURL}/order/checkout?order_id=${order_id}`,
        "",
        config
      );
      dispatch({
        type: ActionType.ORDER_PAY_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.ORDER_PAY_FAIL,
        payload: error,
      });
    }
  };
};

export const getUser = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_USER_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const { data } = await axios.get(
        `${SERVER.baseURL}/user/profile`,
        config
      );

      dispatch({
        type: ActionType.GET_USER_SUCCESS,
        payload: data.data,
      });
      console.log('data: ', data.data)
      localStorage.setItem("userDetail", JSON.stringify(data.data));

    } catch (error: any) {
      dispatch({
        type: ActionType.GET_USER_FAIL,
        payload: error,
      });
    }
  };
};

// export const getUsers = () => {
//   return async (dispatch: Dispatch<Action>) => {
//     try {
//       dispatch({
//         type: ActionType.GET_USER_REQUEST,
//       });

//       const token = `${localStorage.getItem("access_token")}`;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${token}`,
//         },
//       };

//       const { data } = await axios.get(
//         `${SERVER.baseURL}/user/profile`,
//         config
//       );

//       dispatch({
//         type: ActionType.GET_USER_SUCCESS,
//         payload: data,
//       });
//     } catch (error: any) {
//       dispatch({
//         type: ActionType.GET_USER_FAIL,
//         payload: error,
//       });
//     }
//   };
// };

export const deliverOrder = (id: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.ORDER_DELIVER_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const { data } = await axios.put(
        `${SERVER.baseURL}/order/${id}/deliver`,
        {},
        config
      );

      dispatch({
        type: ActionType.ORDER_DELIVER_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.ORDER_DELIVER_FAIL,
        payload: error,
      });
    }
  };
};

export const createProduct = (
  name: string,
  price: number,
  image: string,
  brand: string,
  category: string,
  countInStock: number,
  numReviews: number,
  description: string
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.CREATE_PRODUCT_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const formData = {
        name,
        image,
        brand,
        category,
        description,
        price,
        countInStock,
      };

      const { data } = await axios.post(
        `${SERVER.baseURL}/product/add`,
        formData,
        config
      );

      dispatch({
        type: ActionType.CREATE_PRODUCT_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.CREATE_PRODUCT_FAIL,
        payload: error,
      });
    }
  };
};

export const getMyOrders = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_MY_ORDERS_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const { data } = await axios.get(`${SERVER.baseURL}/order`, config);
      dispatch({
        type: ActionType.GET_MY_ORDERS_SUCCESS,
        payload: data.data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_MY_ORDERS_FAIL,
        payload: error,
      });
    }
  };
};

export const updateProfile = (
  username?: string,
  email?: string,
  password?: string
) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    try {
      dispatch({
        type: ActionType.UPDATE_PROFILE_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const formData = {
        username,
        email,
        password,
      };

      const { data } = await axios.put(
        `${SERVER.baseURL}/user/profile`,
        formData,
        config
      );

      dispatch({
        type: ActionType.UPDATE_PROFILE_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionType.UPDATE_PROFILE_RESET,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.UPDATE_PROFILE_FAIL,
        payload: error,
      });
    }
  };
};

export const updateUser = (id: string, isAdmin: boolean) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.UPDATE_USER_REQUEST,
      });

      const token = `${localStorage.getItem("access_token")}`;

      const user_id = JSON.parse(`${localStorage.getItem("userInfo")}`).data.detail._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
          id: user_id,
        },
      };

      const formData = {
        isAdmin,
      };

      const { data } = await axios.put(
        `${SERVER.baseURL}/api/v1/users/${id}`,
        formData,
        config
      );

      dispatch({
        type: ActionType.UPDATE_USER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionType.UPDATE_USER_RESET,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.UPDATE_USER_FAIL,
        payload: error,
      });
    }
  };
};
