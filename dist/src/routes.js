"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const auth_role_1 = require("@hellocacbantre/auth-role");
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const express_1 = require("express");
const config_1 = require("./config");
const auth_controller_1 = require("./controllers/auth.controller");
class AuthRouter {
    constructor() {
        this.context = {
            mongoDb: {
                uri: config_1.Env.MONGO_CONNECTION.URI,
                options: config_1.Env.MONGO_CONNECTION.OPTIONS
            },
            redisDb: {
                uri: config_1.Env.REDIS_CONNECTION.URI
            }
        };
        this.authCtl = new auth_controller_1.AuthController(this.context);
        this.authRole = new auth_role_1.AuthRole(this.context);
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        const { authCtl, authRole } = this;
        this.router.route('/sign-in').post(authCtl.signIn);
        this.router.route('/sign-up').post(authCtl.signUp);
        this.router.route('/userinfo-by-token').get(authRole.isUser, authCtl.userinfo);
        this.router.route('/test').get(authRole.checkRole(db_schemas_1.ACCOUNT_ROLES_TYPE.User), (req, res) => {
            return res.json({ success: true });
        });
    }
}
exports.AuthRouter = AuthRouter;
