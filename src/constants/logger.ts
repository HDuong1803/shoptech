import type { Request, Response } from 'express'
import winston from 'winston'
import path from 'path'
/**
 * Creates a new instance of a Winston logger with the specified formats and transports.
 * @returns {Logger} - A new instance of a Winston logger.
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.colorize(),
    winston.format.printf((log: any) => {
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`
      return `[${log.timestamp}] [${log.level}] ${log.message}`
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: 'error',
      filename: path.join(__dirname, '../logs/error.log')
    }),
    new winston.transports.File({
      level: 'info',
      filename: path.join(__dirname, '../logs/info.log')
    })
  ]
})

/**
 * Logs the details of an HTTP request and response to the console.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {number} time - The time taken to process the request in milliseconds.
 */
const logRequest = (req: Request, res: Response, time: number) => {
  const { method, url, ip, headers, body, query } = req
  const { statusCode } = res
  const authorization = headers.authorization
  logger.info({
    message: `[${method}] ${url} ${ip} authorization=${authorization} body=${JSON.stringify(
      body
    )} query=${JSON.stringify(query)} status=${statusCode} time=${time}ms`,
    method,
    url,
    ip,
    authorization,
    body,
    query,
    duration: time,
    status: statusCode
  })
}

const logError = (err: Error, req: Request, prefix: string = '') => {
  const { method, url, ip, headers, body, query } = req
  const authorization = headers.authorization
  logger.error({
    message: `${prefix}[${method}] ${url} ${ip} authorization=${authorization} body=${JSON.stringify(
      body
    )} query=${JSON.stringify(query)}`,
    method,
    url,
    ip,
    authorization,
    body,
    query,
    error: err.message,
    stack: err.stack,
    prefix
  })
}

export { logger, logRequest, logError }
