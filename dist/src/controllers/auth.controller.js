"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_action_1 = require("../actions/auth.action");
const catchAsync_1 = __importDefault(require("../middlewares/catchAsync"));
const metrics_1 = require("../utils/metrics");
const redis_1 = require("@hellocacbantre/redis");
class AuthController {
    constructor(context) {
        this.signUp = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
            timer({ operation: 'auth_sign_up', success: 'true' });
            const { newUser, refreshToken, token } = yield this.authAction.signUp(this.context)(req.body);
            // add redis
            void this.falcol.set(`auth:refreshToken:${newUser._id}`, refreshToken);
            void this.falcol.expire(`auth:refreshToken:${newUser._id}`, 2592000);
            res.set('Authorization', `Bearer ${token}`);
            res.cookie('token', token, { httpOnly: true, maxAge: 604800 * 1000 });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 2592000 * 1000
            });
            return res.json({
                status: 200,
                data: newUser
            });
        }));
        this.signIn = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
            timer({ operation: 'auth_sign_in', success: 'true' });
            const { user, refreshToken, token } = yield this.authAction.signIn(this.context)(req.body);
            // add redis
            void this.falcol.set(`auth:refreshToken:${user._id}`, refreshToken);
            void this.falcol.expire(`auth:refreshToken:${user._id}`, 2592000);
            res.set('Authorization', `Bearer ${token}`);
            res.cookie('token', token, { httpOnly: true, maxAge: 604800 * 1000 });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 2592000 * 1000
            });
            return res.json({
                status: 200,
                data: user
            });
        }));
        this.authAction = new auth_action_1.AuthAction(context);
        this.context = context;
        const { redisDb } = this.context;
        this.falcol = new redis_1.SimpleFalcon(redisDb, 'auth');
    }
}
exports.AuthController = AuthController;
