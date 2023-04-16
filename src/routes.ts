import { Router } from 'express'
import { AuthController } from './controllers/auth.controller'
import AuthRole from './middlewares/authRole'
// import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'

export class AuthRouter {
  public router: Router

  constructor(
    private readonly authCtl: AuthController = new AuthController(),
    private readonly authRole: AuthRole = new AuthRole()
  ) {
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
