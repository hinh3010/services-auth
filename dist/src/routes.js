"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const mongo_db_1 = require("./connections/mongo.db");
const express_1 = require("express");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_role_1 = require("@hellocacbantre/auth-role");
const redisio_db_1 = require("./connections/redisio.db");
class AuthRouter {
    constructor() {
        this.context = {
            mongodb: mongo_db_1.platformDb,
            redisDb: redisio_db_1.RedisIoClient
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
        this.router.route('/test').get(
        // authRole.checkRole(ACCOUNT_ROLES_TYPE.User),
        authRole.isUser, (req, res) => {
            return res.json({ success: true });
        });
    }
}
exports.AuthRouter = AuthRouter;
