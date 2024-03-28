import type * as express from 'express'

/**
 * Express middleware function for authentication.
 * @param {express.Request} _request - The request object.
 * @param {string} _securityName - The name of the security protocol.
 * @param {string[]} _scopes - The scopes required for authentication.
 * @returns {Promise<any>} - A promise that resolves to an empty object.
 */
export async function expressAuthentication(
  _request: express.Request,
  _securityName: string,
  _scopes: string[]
): Promise<any> {
  return await Promise.resolve({})
}
