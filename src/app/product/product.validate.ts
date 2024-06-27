import type { InputItem, InputReview } from '@app'
import { type FieldErrors } from 'tsoa'

/**
 * Validates the input for adding a product item.
 * @param {InputItem} body - The input object containing the product details.
 * @returns {FieldErrors | null} - FieldErrors if there are validation errors, null otherwise.
 */
export const inputItemValidate = (body: InputItem): FieldErrors | null => {
  try {
    if (
      !body?.name ||
      !body?.image ||
      !body?.brand ||
      !body?.category ||
      !body?.description ||
      !body?.price ||
      body?.price <= 0 ||
      !body?.count_in_stock ||
      body?.count_in_stock < 0
    ) {
      return {
        error: {
          message:
            'Invalid product item data. Please provide all required fields with valid values.',
          value: body
        }
      }
    }

    // Add additional validation rules as needed

    return null
  } catch (error: any) {
    return {
      error: {
        message: error.message,
        value: body
      }
    }
  }
}

/**
 * Validates the input for adding a product review.
 * @param {InputReview} body - The input object containing the review details.
 * @returns {FieldErrors | null} - FieldErrors if there are validation errors, null otherwise.
 */
export const inputReviewValidate = (body: InputReview): FieldErrors | null => {
  try {
    if (
      !body?.rating ||
      body?.rating < 1 ||
      body?.rating > 5 ||
      !body?.comment ||
      body?.comment.trim() === ''
    ) {
      return {
        error: {
          message:
            'Invalid review data. Please provide a rating between 1 and 5 and a non-empty comment.',
          value: body
        }
      }
    }

    return null
  } catch (error: any) {
    return {
      error: {
        message: error.message,
        value: body
      }
    }
  }
}
