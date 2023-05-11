import { AuthRouter } from './routes'
import express, { type Request, type Response, type Router } from 'express'
import 'reflect-metadata'
import Logger from './@loggers'
import { type IError } from './@types'
import { Env } from './config'
import { serverLoader } from './server.loader'
import { type IContext } from '@hellocacbantre/context'

// import { startMetricsServer } from './utils/metrics'
// import swaggerDocs from './utils/swagger'

const handlerError = (err: IError, _: Request, res: Response, __: any) => {
  return res.json({
    status: err.status ?? 500,
    message: err.message
  })
}

class Server {
  public app: express.Application = express()

  readonly context: IContext = {
    mongoDb: {
      uri: Env.MONGO_CONNECTION.URI,
      options: Env.MONGO_CONNECTION.OPTIONS
    },
    redisDb: {
      uri: Env.REDIS_CONNECTION.URI
    }
  }

  constructor() {
    void serverLoader(this.app)

    this.app.use(`/${Env.SERVICE_NAME}`, this.routes())

    this.app.get('/*', (_: Request, res: Response) => {
      res.json({
        message: `welcome ${Env.SERVICE_NAME} service`
      })
    })

    this.app.use(handlerError)

    this.listen(Number(Env.PORT))
  }

  routes(): Router {
    return new AuthRouter(this.context).router
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      Logger.info(`[Server_Start:::] http://localhost:${port}/`)
      // swaggerDocs(this.app, port)
      // startMetricsServer(this.app, port)
    })
  }
}

// eslint-disable-next-line no-new
new Server()
