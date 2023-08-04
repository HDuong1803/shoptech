import { Constant } from '@constants'
import type { Controller, FieldErrors } from 'tsoa'
/**
 * An interface representing a successful response from an API call.
 * @template T - The type of data returned in the response.
 * @property {T | any} data - The data returned in the response.
 * @property {string} message - A message describing the response.
 * @property {boolean} success - A boolean indicating whether the API call was successful.
 * @property {number | undefined} count - The number of items returned in the response.
 * @property {number | undefined} total - The total number of items available.
 */
interface SuccessResponse<T> {
  data: T | any
  message: string
  success: boolean
  count?: number
  total?: number
}

/**
 * Defines the structure of an error response object.
 * @interface ErrorResponse
 * @property {string} message - A message describing the error.
 * @property {boolean} success - A boolean indicating whether the request was successful or not.
 * @property {any} [data] - Optional data to include with the error response.
 */
interface ErrorResponse {
  message: string
  success: boolean
  data?: any
}
/**
 * A union type that represents either a successful response or an error response.
 * @template T - The type of the data returned in a successful response.
 * @typedef {SuccessResponse<T> | ErrorResponse} Option<T>
 */
type Option<T> = SuccessResponse<T> | ErrorResponse

/**
 * Handles errors that occur during network requests and returns an error response object.
 * @param {any} error - the error object or message
 * @param {Controller} [controller] - the controller object to set the status code on
 * @returns An error response object with a message, success status, and data.
 */
function onError(error: any, controller?: Controller): ErrorResponse {
  let msg = null
  if (controller) {
    controller.setStatus(Constant.NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
  if (typeof error === 'object') {
    msg = error.message
    for (const [key, status_message] of Object.entries(
      Constant.NETWORK_STATUS_MESSAGE
    )) {
      if (error.message === status_message && controller) {
        controller.setStatus(
          Constant.NETWORK_STATUS_CODE[
            key as keyof typeof Constant.NETWORK_STATUS_CODE
          ]
        )
      }
    }
  } else {
    msg = error
  }
  return {
    message: msg || Constant.NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    success: false,
    data: error
  }
}

/**
 * Returns a success response object with the given data and total count.
 * @param {T} [data] - The data to include in the response object.
 * @param {number} [total] - The total count of items in the response object.
 * @returns {SuccessResponse<T>} - A success response object with the given data and total count.
 * If the data is an array, the count property will be set to the length of the array.
 * If the data is not an array, the count property will be set to 1.
 * The message property will be set to "SUCCESS" if the data is not an empty array, and "EMPTY" otherwise.
 */
function onSuccess<T = undefined | JSON>(
  data?: T,
  total?: number
): SuccessResponse<T> {
  if (Array.isArray(data)) {
    return {
      data,
      success: true,
      message:
        data.length === 0
          ? Constant.NETWORK_STATUS_MESSAGE.EMPTY
          : Constant.NETWORK_STATUS_MESSAGE.SUCCESS,
      count: data.length,
      total
    }
  }
  return {
    data,
    success: true,
    message: Constant.NETWORK_STATUS_MESSAGE.SUCCESS,
    count: 1,
    total
  }
}

class ErrorHandler extends Error {
  fields: FieldErrors
  constructor(fields: FieldErrors, message: string) {
    super(message)
    this.fields = fields
  }
}

export { onError, onSuccess, type Option, ErrorHandler }
