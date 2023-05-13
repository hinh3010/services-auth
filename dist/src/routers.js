"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const auth_role_1 = require("@hellocacbantre/auth-role");
const auth_controller_1 = require("./controllers/auth.controller");
const base_router_1 = require("./base.router");
// import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'
class AuthRouter extends base_router_1.BaseRouter {
    constructor(context) {
        super(context);
        this.authCtl = new auth_controller_1.AuthController(context);
        this.authRole = new auth_role_1.AuthRole(context);
    }
    configureRoutes() {
        this.router.post('/sign-in', this.authCtl.signIn);
        this.router.post('/sign-up', this.authCtl.signUp);
        this.router.get('/userinfo-by-token', this.authRole.isUser, this.authCtl.userinfo);
        // this.router.get('/test', this.authRole.checkRole(ACCOUNT_ROLES_TYPE.User), (req, res) => {
        //   return res.json({ success: true })
        // })
    }
}
exports.AuthRouter = AuthRouter;
