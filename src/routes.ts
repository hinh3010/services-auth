import { platformDb } from './connections/mongo.db'
import { type IContext } from './@types/interfaces'
import { Router } from 'express'
import { AuthController } from './controllers/auth.controller'
import { AuthRole } from '@hellocacbantre/auth-role'
import { RedisIoClient } from './connections/redisio.db'

export class AuthRouter {
  public router: Router
  readonly context: IContext = {
    mongodb: platformDb,
    redisDb: RedisIoClient
  }

  private readonly authCtl: AuthController
  private readonly authRole: AuthRole

  constructor() {
    this.authCtl = new AuthController()
    this.authRole = new AuthRole(this.context)
    this.router = Router()
    this.routes()
  }

  routes(): void {
    const { authCtl, authRole } = this

    this.router.route('/sign-in').post(authCtl.signIn)
    this.router.route('/sign-up').post(authCtl.signUp)
    this.router.route('/test').get(
      // authRole.checkRole(ACCOUNT_ROLES_TYPE.User),
      authRole.isUser,
      (req, res) => {
        return res.json({ success: true })
      }
    )
  }
}
