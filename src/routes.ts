import { AuthRole } from '@hellocacbantre/auth-role'
import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'
import { Router } from 'express'
import { Env } from './config'
import { AuthController } from './controllers/auth.controller'
import { type IContext } from '@hellocacbantre/context'

export class AuthRouter {
  public router: Router

  readonly context: IContext = {
    mongoDb: {
      uri: Env.MONGO_CONNECTION.URI,
      options: Env.MONGO_CONNECTION.OPTIONS
    },
    redisDb: {
      uri: Env.REDIS_CONNECTION.URI
    }
  }

  private readonly authCtl: AuthController
  private readonly authRole: AuthRole

  constructor() {
    this.authCtl = new AuthController(this.context)
    this.authRole = new AuthRole(this.context)
    this.router = Router()
    this.routes()
  }

  routes(): void {
    const { authCtl, authRole } = this

    this.router.route('/sign-in').post(authCtl.signIn)
    this.router.route('/sign-up').post(authCtl.signUp)
    this.router.route('/userinfo-by-token').get(authRole.isUser, authCtl.userinfo)
    this.router.route('/test').get(authRole.checkRole(ACCOUNT_ROLES_TYPE.User), (req, res) => {
      return res.json({ success: true })
    })
  }
}
