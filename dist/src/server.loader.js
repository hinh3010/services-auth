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
exports.serverLoader = void 0;
const redis_1 = require("@hellocacbantre/redis");
const compression_1 = __importDefault(require("compression"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const response_time_1 = __importDefault(require("response-time"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const config_1 = require("./config");
const redisio_db_1 = require("./connections/redisio.db");
const metrics_1 = require("./utils/metrics");
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
function serverLoader(app) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public'), {
            maxAge: 31557600000
        }));
        app.use((0, morgan_1.default)('dev'));
        // set security HTTP headers
        app.use((0, helmet_1.default)());
        // parse json request body
        app.use(express_1.default.json());
        // parse urlencoded request body
        app.use(express_1.default.urlencoded({ extended: true }));
        // sanitize request data
        app.use((0, xss_clean_1.default)());
        app.use((0, express_mongo_sanitize_1.default)());
        // gzip compression
        app.use((0, compression_1.default)());
        // metrics data
        app.use((0, response_time_1.default)((req, res, time) => {
            var _a;
            if ((_a = req === null || req === void 0 ? void 0 : req.route) === null || _a === void 0 ? void 0 : _a.path) {
                metrics_1.restResponseTimeHistogram.observe({
                    method: req.method,
                    route: req.route.path,
                    status_code: res.statusCode
                }, time * 1000);
            }
        }));
        // enable cors
        app.use((0, cors_1.default)({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true
        }));
        app.options('*', (0, cors_1.default)());
        // trust first proxy
        if (config_1.Env.NODE_ENV === 'production') {
            app.set('trust proxy', 1);
        }
        // cookies
        app.use((0, cookie_parser_1.default)());
        // session
        const falcol = new redis_1.SimpleFalcon(redisio_db_1.redisClient);
        app.use((0, express_session_1.default)({
            secret: (_a = (yield falcol.get('global_setting:session_secret'))) !== null && _a !== void 0 ? _a : 'hellocacbantre',
            resave: false,
            saveUninitialized: true,
            store: new RedisStore({ client: redisio_db_1.redisClient }),
            cookie: {
                secure: config_1.Env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 5 * 60 * 1000 // Cookie lifetime, in milliseconds. // 5 minutes
                // path: "Đường dẫn của cookie, mặc định là '/'",
                // expires: 'The expiration date of a cookie, represented as a Date object'
            }
        }));
        // passport
        app.use(passport_1.default.initialize());
    });
}
exports.serverLoader = serverLoader;
