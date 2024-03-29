import 'dotenv/config'
import cors from 'cors'
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express'
import 'module-alias/register'
import swaggerUi from 'swagger-ui-express'
import responseTime from 'response-time'
import { RegisterRoutes } from '../build/routes'
import { Constant, logRequest, logger, onError } from '@constants'
import { initialAdmin, initialDatabase, handler } from '@providers'
import { type FieldErrors, ValidateError } from 'tsoa'
import JSONBigint from 'json-bigint'

initialDatabase()
  .then(() => {
    initialAdmin()
      .then(() => {
        logger.info(`[InitialAdmin] ${Constant.ADMIN_INITIAL_EMAIL}`)
      })
      .catch((error: any) => {
        logger.error(`[InitialAdmin]1 ${error.message}`)
      })
  })
  .catch((error: any) => {
    logger.error(`[InitialDatabase] ${error.message}`)
  })

/**
 * Creates an Express app and sets up middleware for handling JSON and URL encoded data,
 * enabling CORS, and setting headers for allowing various HTTP methods and headers.
 */
const app = express()
app.set('/webhook', handler)
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      if (buf?.length) {
        req.rawBody = JSON.parse(
          JSONBigint.stringify(
            JSONBigint({
              storeAsString: true
            }).parse(buf.toString('utf8'))
          )
        )
      }
    }
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(function (_req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

/**
 * Middleware function that logs incoming requests to the server.
 */
app.use(responseTime(logRequest))

/**
 * Middleware function that serves the Swagger UI documentation.
 */
app.use('/docs', swaggerUi.serve, (_req: Request, res: Response): any => {
  return new Promise((resolve, reject) => {
    import('../build/swagger.json')
      .then(swaggerDocument => {
        resolve(res.send(swaggerUi.generateHTML(swaggerDocument)))
      })
      .catch(reject)
  })
})

logger.info('Server start at ' + new Date().toUTCString())

/**
 * Starts the server on the specified port and logs a message to the console.
 */
const PORT = Constant.PORT !== undefined ? parseInt(`${Constant.PORT}`) : 3000

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`)
})
RegisterRoutes(app)

/**
 * Express middleware function that handles errors thrown by the application.
 */
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Response | void {
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, err.fields)
    const processedFields: FieldErrors = {}
    for (const field of Object.keys(err.fields)) {
      processedFields[field.replace('body.', '')] = err.fields[field]
    }
    return res.status(Constant.NETWORK_STATUS_CODE.VALIDATE_ERROR).json(
      onError({
        ...processedFields,
        message: Constant.NETWORK_STATUS_MESSAGE.VALIDATE_ERROR
      })
    )
  }
  if (err instanceof Error) {
    return res
      .status(Constant.NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(onError(err.message))
  }

  next()
})
