import { AuthRole } from '@hellocacbantre/auth-role'
import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'
import { Router } from 'express'
import { AuthController } from './controllers/auth.controller'
import { type IContext } from '@hellocacbantre/context'

export class AuthRouter {
  public router: Router
  private readonly context: IContext

  private readonly authCtl: AuthController
  private readonly authRole: AuthRole

  constructor(context: IContext) {
    this.context = context
    this.authCtl = new AuthController(context)
    this.authRole = new AuthRole(context)
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
