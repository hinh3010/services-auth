import { AuthRole } from '@hellocacbantre/auth-role'
import { AuthController } from './controllers/auth.controller'
import { type IContext } from '@hellocacbantre/context'
import { BaseRouter } from './base.router'
// import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'

export class AuthRouter extends BaseRouter {
  private readonly authCtl: AuthController
  private readonly authRole: AuthRole

  constructor(context: IContext) {
    super(context)
    this.authCtl = new AuthController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    this.router.post('/sign-in', this.authCtl.signIn)
    this.router.post('/sign-up', this.authCtl.signUp)
    this.router.get('/userinfo-by-token', this.authRole.isUser, this.authCtl.userinfo)
    // this.router.get('/test', this.authRole.checkRole(ACCOUNT_ROLES_TYPE.User), (req, res) => {
    //   return res.json({ success: true })
    // })
  }
}
