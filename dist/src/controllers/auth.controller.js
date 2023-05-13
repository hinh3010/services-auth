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
const config_1 = require("../config");
const redisio_db_1 = require("../connections/redisio.db");
const catchAsync_1 = __importDefault(require("../middlewares/catchAsync"));
const convertToSeconds_1 = require("../utils/convertToSeconds");
// import { databaseResponseTimeHistogram } from '../utils/metrics'
class AuthController {
    constructor(context) {
        this.signUp = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // const timer = databaseResponseTimeHistogram.startTimer()
            // timer({ operation: 'auth_sign_up', success: 'true' })
            const { newUser, refreshToken, token } = yield this.authAction.signUp(this.context)(req.body);
            const refreshTokenExpiresString = yield (0, config_1.getGlobalSetting)(this.context)('jwt_refresh_token_expires');
            const refreshTokenExpiresSeconds = (0, convertToSeconds_1.convertToSeconds)(refreshTokenExpiresString);
            // add redis
            void this.falcol.set(`auth:refreshToken:${newUser._id}`, refreshToken);
            void this.falcol.expire(`auth:refreshToken:${newUser._id}`, refreshTokenExpiresSeconds);
            res.set('Authorization', `Bearer ${token}`);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: refreshTokenExpiresSeconds * 1000
            });
            return res.json({
                status: 200,
                data: {
                    newUser,
                    token
                }
            });
        }));
        this.signIn = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // const timer = databaseResponseTimeHistogram.startTimer()
            // timer({ operation: 'auth_sign_in', success: 'true' })
            const { user, refreshToken, token } = yield this.authAction.signIn(this.context)(req.body);
            const refreshTokenExpiresString = yield (0, config_1.getGlobalSetting)(this.context)('jwt_refresh_token_expires');
            const refreshTokenExpiresSeconds = (0, convertToSeconds_1.convertToSeconds)(refreshTokenExpiresString);
            // add redis
            void this.falcol.set(`auth:refreshToken:${user._id}`, refreshToken);
            void this.falcol.expire(`auth:refreshToken:${user._id}`, refreshTokenExpiresSeconds);
            res.set('Authorization', `Bearer ${token}`);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: refreshTokenExpiresSeconds * 1000
            });
            return res.json({
                status: 200,
                data: {
                    user,
                    token
                }
            });
        }));
        this.userinfo = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // const timer = databaseResponseTimeHistogram.startTimer()
            // timer({ operation: 'auth_userinfo_by_token', success: 'true' })
            const userInfo = req.user;
            delete userInfo.password;
            return res.json({
                status: 200,
                data: userInfo
            });
        }));
        this.authAction = new auth_action_1.AuthAction(context);
        this.context = context;
        this.falcol = (0, redisio_db_1.getFalcol)(context);
    }
}
exports.AuthController = AuthController;
